import { AbstractComponent } from '../framework/view/abstract-component.js';

function createEmptyTaskTemplate() {
  return `
    <div class="empty-task">
      Перетащите карточку
    </div>
  `;
}

export default class EmptyTaskComponent extends AbstractComponent {
  get template() {
    return createEmptyTaskTemplate();
  }
}
