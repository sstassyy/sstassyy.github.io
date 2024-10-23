import TaskComponent from '../view/task-component.js';
import { render, remove } from '../framework/render.js';

export default class TaskPresenter {
  #taskContainer = null;
  #task = null;
  #taskComponent = null;

  constructor({ taskContainer }) {
    this.#taskContainer = taskContainer;
  }

  init(task) {
    this.#task = task;
    this.#taskComponent = new TaskComponent({ task: this.#task });
    render(this.#taskComponent, this.#taskContainer);
    this.#taskComponent.element.draggable = true;
    this.#taskComponent.element.addEventListener('dragstart', this.#handleDragStart.bind(this));
    this.#taskComponent.element.addEventListener('dragend', this.#handleDragEnd.bind(this));
  }

  destroy() {
    remove(this.#taskComponent);
  }

  updateTask(updatedTask) {
    this.#task = updatedTask;
    this.#taskComponent.updateElement({ task: this.#task });
  }

  #handleDragStart(event) {
    event.dataTransfer.setData('text/plain', this.#task.id);
    event.target.classList.add('dragging');
  }

  #handleDragEnd(event) {
    event.target.classList.remove('dragging');
  }
}
