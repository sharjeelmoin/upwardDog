var Store = require('flux/utils').Store;
var AppDispatcher = require('../dispatcher/dispatcher.js');
var TasksConstants = require('../constants/TasksConstants');
var SessionStore = require('./SessionStore');
var ProjectsStore = require('./ProjectsStore');

var TasksStore = new Store(AppDispatcher);

window._tasks = {};

var _resetTasks = function (tasks) {

  _tasks = {};

  tasks.forEach(function (task) {
    _tasks[task.id] = task;
  });
};

var _setTask = function (task) {
  _tasks[task.id] = task;
};

var _removeTask = function (task) {
  delete _tasks[task.id];
};

TasksStore.all = function () {
  var tasks = Object.keys(_tasks).map(function(id){
    return _tasks[id];
  });

  return tasks;
};

TasksStore.find = function (id) {
  return _tasks[id];
};

TasksStore.__onDispatch = function (payload) {
  switch(payload.actionType) {
    case TasksConstants.TASKS_RECEIVED:
      _resetTasks(payload.tasks);
      TasksStore.__emitChange();
      break;
    case TasksConstants.TASK_RECEIVED:
      _setTask(payload.task);
      TasksStore.__emitChange();
      break;
    case TasksConstants.TASK_REMOVED:
      _removeTask(payload.task);
      TasksStore.__emitChange();
      break;
  }
};


module.exports = TasksStore;
