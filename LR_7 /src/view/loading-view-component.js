import { AbstractComponent } from '../framework/view/abstract-component.js';

function createLoadingTemplate() {
  return (
    '<div class="loading-container">' +
      '<p class="loading-text">Loading...</p>' +
    '</div>'
  );
}

export default class LoadingViewComponent extends AbstractComponent {
  get template() {
    return createLoadingTemplate();
  }
}
