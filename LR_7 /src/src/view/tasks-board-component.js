import { AbstractComponent } from '../framework/view/abstract-component.js';

function createTasksBoardComponentTemplate() {
  return `
    <section class="tasks">
      <ul class="task-list"></ul> <!-- Обертка для всех столбцов -->
    </section>
  `;
}

export default class TasksBoardComponent extends AbstractComponent {
  get template() {
    return createTasksBoardComponentTemplate();
  }
}
