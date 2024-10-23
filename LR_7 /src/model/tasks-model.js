import { generateId } from '../utils/utils.js';
import Observable from '../framework/observable.js';
import { UserAction } from '../const.js';

export default class TasksModel extends Observable {
  #tasksApiService = null;
  #boardtasks = [];

  constructor({ tasksApiService }) {
    super();
    this.#tasksApiService = tasksApiService;
    this.init();
  }

  get tasks() {
    return this.#boardtasks;
  }

  async init() {
    try {
      const response = await this.#tasksApiService.tasks;
      this.#boardtasks = response;
      console.log('Загруженные задачи:', this.#boardtasks);
      this._notify('INIT');
    } catch (err) {
      console.error('Ошибка при загрузке задач:', err);
      this.#boardtasks = [];
    }
  }

  async addTask(title) {
    const newTask = {
      title,
      status: 'backlog',
      id: generateId(),
    };
    try {
      const createdTask = await this.#tasksApiService.addTask(newTask);
      this.#boardtasks.push(createdTask);
      this._notify(UserAction.ADD_TASK, createdTask);
      return createdTask;
    } catch (err) {
      console.error('Ошибка при добавлении задачи на сервер:', err);
      throw err;
    }
  }

  async updateTaskStatus(taskId, newStatus) {
    const task = this.#boardtasks.find(task => task.id === taskId);
    const previousStatus = task.status;

    if (task) {
      task.status = newStatus;
      try {
        const updatedTask = await this.#tasksApiService.updateTask(task);
        Object.assign(task, updatedTask);
        this._notify(UserAction.UPDATE_TASK, task);
      } catch (err) {
        console.error('Ошибка при обновлении статуса задачи на сервер:', err);
        task.status = previousStatus;
        throw err;
      }
    }
  }

  deleteTask(taskId) {
    this.#boardtasks = this.#boardtasks.filter(task => task.id !== taskId);
    this._notify(UserAction.DELETE_TASK, { id: taskId });
  }

  async clearBasketTasks() {
    const basketTasks = this.#boardtasks.filter(task => task.status === 'basket');
    try {
      await Promise.all(basketTasks.map(task => this.#tasksApiService.deleteTask(task.id)));
      this.#boardtasks = this.#boardtasks.filter(task => task.status !== 'basket');
      this._notify(UserAction.DELETE_TASK, { status: 'basket' });
    } catch (err) {
      console.error('Ошибка при удалении задач из корзины на сервере:', err);
      throw err;
    }
  }

  hasBasketTasks() {
    return this.#boardtasks.some(task => task.status === 'basket');
  }

  getTasksByStatus(status) {
    return this.#boardtasks.filter(task => task.status === status);
  }
}
