import HeaderComponent from './view/header-component.js';
import TasksBoardPresenter from './presenter/tasks-board-presenter.js';
import TasksModel from './model/tasks-model.js';
import TasksApiService from './tasks-api-service.js';
import { render, RenderPosition } from './framework/render.js';

const END_POINT = 'https://671923b67fc4c5ff8f4c9876.mockapi.io';
const bodyContainer = document.querySelector('.board-app');
const tasksBoardContainer = document.querySelector('.taskboard');

const tasksModel = new TasksModel({
  tasksApiService: new TasksApiService(END_POINT)
});

render(new HeaderComponent(), bodyContainer, RenderPosition.BEFOREBEGIN);

tasksModel.init().then(() => {
  const tasksBoardPresenter = new TasksBoardPresenter({
    boardContainer: tasksBoardContainer,
    tasksModel,
  });
  tasksBoardPresenter.init();
});
