// El styles lo importamos aquí, ya se carga después al compilar todo
import '../scss/styles.scss';

const tasksElement = document.getElementById('tasks');
const filtersElement = document.getElementById('filters');
const formElement = document.getElementById('form');
const itemsLeftElement = document.getElementById('items-left');
const deleteCompleteElement = document.getElementById('delete-completed');
const switchElement = document.getElementById('switch');
const allFilters = document.querySelectorAll('.filter');

const FILTERS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed'
};

let allTasks = [
  {
    id: Date.now(),
    task: 'Make a todo app',
    completed: false
  }
];

let currentFilter = FILTERS.ALL;

let darkMode = false;

const changeTheme = () => {
  darkMode = !darkMode;
  document.body.classList.remove('light', 'dark');
  if (darkMode) {
    document.body.classList.add('dark');
    switchElement.src = '../assets/icon-sun.svg';
  } else {
    document.body.classList.add('light');
    switchElement.src = '../assets/icon-moon.svg';
  }
};

const countItemsLeft = () => {
  const itemsLeft = allTasks.filter(task => !task.completed).length;
  if (allTasks.length === 0) {
    itemsLeftElement.textContent = 'No Tasks';
    return;
  }

  if (itemsLeft === 0) {
    itemsLeftElement.textContent = 'All tasks completed!';
  } else {
    itemsLeftElement.textContent = `${itemsLeft} items left.`;
  }
};

const filterTasks = () => {
  let filteredTasks = allTasks;

  if (currentFilter === FILTERS.ACTIVE) {
    filteredTasks = allTasks.filter(task => !task.completed);
  } else if (currentFilter === FILTERS.COMPLETED) {
    filteredTasks = allTasks.filter(task => task.completed);
  }

  return filteredTasks;
};

const insertTasks = () => {
  const fragment = document.createDocumentFragment();
  const filteredTasks = filterTasks();

  filteredTasks.forEach(todo => {
    const newTaskContainer = document.createElement('div');
    newTaskContainer.classList.add('task-container');

    const newTaskCheck = document.createElement('input');
    newTaskCheck.id = todo.id;
    newTaskCheck.classList.add('task-check');
    newTaskCheck.type = 'checkbox';
    newTaskCheck.checked = todo.completed;

    newTaskCheck.addEventListener('change', () => completeTask(todo.id));

    const newTaskText = document.createElement('label');
    newTaskText.classList.add('task-text');
    newTaskText.textContent = todo.task;
    newTaskText.htmlFor = todo.id;

    const newTaskDelete = document.createElement('img');
    newTaskDelete.classList.add('task-delete');
    newTaskDelete.src = './assets/icon-cross.svg';

    newTaskDelete.addEventListener('click', () => deleteTask(todo.id));

    newTaskContainer.append(newTaskCheck, newTaskText, newTaskDelete);

    fragment.append(newTaskContainer);
  });

  tasksElement.textContent = '';
  tasksElement.append(fragment);

  countItemsLeft();
};

const completeTask = id => {
  allTasks = allTasks.map(task => {
    if (task.id === id) {
      task.completed = !task.completed;

      // true = !true
      // false = !false
    }
    return task;
  });

  insertTasks();
  console.log(allTasks);
};

const deleteTask = id => {
  allTasks = allTasks.filter(task => task.id !== id);
  insertTasks();
};

const createTask = task => {
  const newTask = {
    id: Date.now(),
    task: task,
    completed: false
  };

  allTasks.push(newTask);

  insertTasks();
};

const setFilter = filterTarget => {
  allFilters.forEach(filter => filter.classList.remove('filter--active'));
  filterTarget.classList.add('filter--active');
  insertTasks();
};

const deleteAllCompletedTasks = () => {
  allTasks = allTasks.filter(task => !task.completed);
  insertTasks();
};

insertTasks();

formElement.addEventListener('submit', event => {
  event.preventDefault();
  if (!event.target.task.value) return;
  createTask(event.target.task.value);
  event.target.reset();
});

filtersElement.addEventListener('click', event => {
  const filter = event.target.dataset.filter;
  if (!filter || currentFilter === filter) return;
  currentFilter = filter;
  setFilter(event.target);
});

deleteCompleteElement.addEventListener('click', deleteAllCompletedTasks);

switchElement.addEventListener('click', changeTheme);
