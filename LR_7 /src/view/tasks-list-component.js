import { StatusLabel } from "../const.js";
import { AbstractComponent } from "../framework/view/abstract-component.js";

function createTasksListComponentTemplate(status, label) {
  return `
    <div class="column ${status.toLowerCase()}">
      <h3 class="column-header">${label}</h3>
      <ul class="tasks__list tasks__${status} list-reset"></ul>
    </div>`;
}

export default class TasksListComponent extends AbstractComponent {
  constructor({ status, label, onTaskDrop }) {
    super();
    this.status = status;
    this.label = label;
    this.#setDropHandler(onTaskDrop);
  }

  get template() {
    return createTasksListComponentTemplate(this.status, this.label);
  }

  #setDropHandler(onTaskDrop) {
    const container = this.element.querySelector('.tasks__list');
    
    container.addEventListener('dragover', (event) => {
      event.preventDefault();
    });
    
    container.addEventListener('drop', (event) => {
      event.preventDefault();
      const taskId = event.dataTransfer.getData('text/plain');
      const dropTarget = event.target.closest('.task-item');
      const index = dropTarget ? Array.from(container.children).indexOf(dropTarget) : container.children.length;
      onTaskDrop(taskId, this.status, index);
    });
  }
}
