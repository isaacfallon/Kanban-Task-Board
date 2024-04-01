// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function readProjectsFromStorage() {
  let projects = localStorage.getItem("tasks");
  if (!projects) {
    return [];
  }
  let projectsParsed = JSON.parse(projects);
  return projectsParsed;
}

function saveProjectsToStorage(projects) {
  localStorage.setItem("tasks", JSON.stringify(projects));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  const taskCard = $('<div>');
  taskCard.addClass('card project-card draggable my-3');
  taskCard.attr('data-project-id', task.id);

  const cardHeader = $('<div>');
  cardHeader.addClass('card-header h4');
  cardHeader.text(task.title);

  const cardBody = $('<div>');
  cardBody.addClass('card-body');

  const cardDate = $('<p>');
  cardDate.addClass('card-text');
  cardDate.text(task.dueDate);

  const cardDesc = $('<p>');
  cardDesc.addClass('card-text');
  cardDesc.text(task.description);

  const cardDeleteButton = $('<button>');
  cardDeleteButton.addClass('btn btn-danger delete');
  cardDeleteButton.text('delete');
  cardDeleteButton.attr('data-project-id', task.id);


  cardBody.append(cardDate);
  cardBody.append(cardDesc);
  cardBody.append(cardDeleteButton);

  taskCard.append(cardHeader);
  taskCard.append(cardBody);

  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readProjectsFromStorage();

  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  for (let task of tasks) {
    const newCard = createTaskCard(task);
    if (task.status === 'to-do') {
      todoList.append(newCard);
    } else if (task.status === 'in-progress') {
      inProgressList.append(newCard);
    } else {
      doneList.append(newCard);
    }
  }

}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();

  const newProject = {
    id: generateTaskId(),
    title: $('#taskTitle').val(),
    dueDate: $('#taskDueDate').val(),
    description: $('#taskDescription').val(),
    status: 'to-do',
  };

  const projects = readProjectsFromStorage();
  projects.push(newProject);

  saveProjectsToStorage(projects);

  renderTaskList();

  $('#taskTitle').val('');
  $('#taskDueDate').val('');
  $('#taskDescription').val('');

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){
  const taskId = $(this).attr('data-project-id');
  const tasks = readProjectsFromStorage();

  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      tasks.splice([i], 1);
    }
  }
  saveProjectsToStorage(tasks);
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, 
// and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  $('.swim-lanes').on('click', '.delete', handleDeleteTask);

  $('#project-form').on('submit', handleAddTask);

    $( "#taskDueDate" ).datepicker({
        changeMonth: true,
        changeYear: true
      });
});
