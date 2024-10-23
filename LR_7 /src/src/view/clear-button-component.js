import { AbstractComponent } from "../framework/view/abstract-component.js";

export default class ClearButtonComponent extends AbstractComponent {
  get template() {
    return `<button class="clear-button">Очистить список</button>`;
  }

  setClickHandler(callback) {
    this.element.addEventListener("click", callback);
  }

  // Метод для включения/отключения кнопки
  toggleDisabled(isDisabled) {
    this.element.disabled = isDisabled;
    this.element.classList.toggle('disabled', isDisabled);
  }
}
