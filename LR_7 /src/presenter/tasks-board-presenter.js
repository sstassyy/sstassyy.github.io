import TasksBoardComponent from '../view/tasks-board-component.js';
import TasksListComponent from '../view/tasks-list-component.js';
import ClearButtonComponent from '../view/clear-button-component.js';
import TaskPresenter from './task-presenter.js';
import FormAddTaskComponent from '../view/form-add-task-component.js';
import LoadingViewComponent from '../view/loading-view-component.js';
import { Status, StatusLabel, UserAction } from '../const.js';
import { render, RenderPosition } from '../framework/render.js';
import EmptyTaskComponent from '../view/empty-task-component.js';

export default class TasksBoardPresenter {
  #boardContainer = null;
  #tasksModel = null;
  #tasksBoardComponent = new TasksBoardComponent();
  #clearButtonComponent = new ClearButtonComponent();
  #formAddTaskComponent = null;
  #taskPresenters = new Map();
  #tasksListComponents = new Map();
  #loadingComponent = null;

  constructor({ boardContainer, tasksModel }) {
    this.#boardContainer = boardContainer;
    this.#tasksModel = tasksModel;
    this.#tasksModel.addObserver(this.#handleModelChange.bind(this));
  }

  async init() {
    this.#renderLoading();
    await this.#tasksModel.init();
    this.#renderBoard();
  }

  #renderLoading() {
    this.#loadingComponent = new LoadingViewComponent();
    render(this.#loadingComponent, this.#boardContainer);
  }

  #renderBoard() {
    this.#loadingComponent.element.remove();
    render(this.#tasksBoardComponent, this.#boardContainer);
    this.#renderTasksList();
    this.#renderClearButton();
    this.#renderFormAddTask();
  }

  #renderTasksList() {
    Object.values(Status).forEach((status) => {
      const tasksListComponent = new TasksListComponent({
        status: status,
        label: StatusLabel[status],
        onTaskDrop: this.#handleTaskDrop.bind(this)
      });
      this.#tasksListComponents.set(status, tasksListComponent);
      render(tasksListComponent, this.#tasksBoardComponent.element);

      const tasksForStatus = this.#tasksModel.tasks.filter((task) => task.status === status);
      this.#updateTasksList(tasksListComponent, tasksForStatus);
    });
  }

  #updateTasksList(tasksListComponent, tasksForStatus) {
    const tasksListElement = tasksListComponent.element.querySelector('.tasks__list');
    tasksListElement.innerHTML = '';

    if (tasksForStatus.length === 0) {
      const emptyTaskComponent = new EmptyTaskComponent();
      render(emptyTaskComponent, tasksListElement);
    } else {
      tasksForStatus.forEach((task) => {
        this.#renderTask(task, tasksListElement);
      });
    }
  }

  #renderTask(task, container) {
    const taskPresenter = new TaskPresenter({ taskContainer: container });
    taskPresenter.init(task);
    this.#taskPresenters.set(task.id, taskPresenter);
  }

  #renderFormAddTask() {
    if (this.#formAddTaskComponent) {
      return;
    }

    this.#formAddTaskComponent = new FormAddTaskComponent({
      onClick: this.createTask.bind(this),
    });

    render(this.#formAddTaskComponent, this.#boardContainer, RenderPosition.BEFOREBEGIN);
  }

  async createTask() {
    const taskTitle = document.querySelector('#add-task').value.trim();
    if (!taskTitle) {
      return;
    }
    try {
      await this.#tasksModel.addTask(taskTitle);
      document.querySelector('#add-task').value = '';
    } catch (err) {
      console.error('Ошибка при создании задачи:', err);
    }
  }

  #renderClearButton() {
    const tasksListComponent = this.#tasksListComponents.get(Status.BASKET);
    if (tasksListComponent) {
      render(this.#clearButtonComponent, tasksListComponent.element, RenderPosition.BEFOREEND);
      this.#clearButtonComponent.setClickHandler(this.#handleClearButtonClick.bind(this));
    }
    this.#updateClearButtonVisibility();
  }

  #handleClearButtonClick() {
    this.#tasksModel.clearBasketTasks();
    this.#updateBoard();
  }

  #handleTaskDrop(taskId, newStatus, index) {
    this.#tasksModel.updateTaskStatus(taskId, newStatus);
    this.#updateBoard();
  }

  #handleModelChange(event, payload) {
    switch (event) {
      case UserAction.ADD_TASK:
      case UserAction.UPDATE_TASK:
      case UserAction.DELETE_TASK:
        this.#updateBoard();
        break;
    }
  }

  #updateBoard() {
    Object.values(Status).forEach((status) => {
      const tasksListComponent = this.#tasksListComponents.get(status);
      this.#updateTasksList(tasksListComponent, this.#tasksModel.tasks.filter(task => task.status === status));
    });
    this.#updateClearButtonVisibility();
  }

  #updateClearButtonVisibility() {
    const tasksInBasket = this.#tasksModel.tasks.filter(task => task.status === 'basket');
    if (tasksInBasket.length === 0) {
      this.#clearButtonComponent.element.style.display = 'none';
    } else {
      this.#clearButtonComponent.element.style.display = 'block';
    }
  }
}
