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

  if (task.dueDate && task.status !== 'done') {
    const now = dayjs();
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    let sevenDaysAway = now.add(7, 'day');

    if (now.isSame(taskDueDate, 'day')) {
      taskCard.addClass('bg-warning text-white');
    } else if (now.isAfter(taskDueDate, 'day')) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteButton.addClass('border-light');
    }

  return taskCard;

}

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

  for (let i of tasks) {
    const newCard = createTaskCard(i);
    if (i.status === 'to-do') {
      todoList.append(newCard);
    } else if (i.status === 'in-progress') {
      inProgressList.append(newCard);
    } else {
      doneList.append(newCard);
    }
  }
  $(".draggable").draggable({
    opacity: 0.5,
    zIndex: 100,

    helper: function(e) {
      const original = $(e.target).hasClass('ui-draggable')
        ? $(e.target)
        : $(e.target).closest('.ui-draggable');

        return original.clone().css({
          width: original.outerWidth(),
        });
    }, 
  });
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

  const tasks = readProjectsFromStorage();

  const taskId = ui.draggable[0].dataset.projectId;

  const newStatus = event.target.id;

  for (i of tasks) {
    if (i.id === taskId) {
      i.status = newStatus;
    }
  }

  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, 
// and make the due date field a date picker
$(document).ready(function () {

  renderTaskList();

  $('.swim-lanes').on('click', '.delete', handleDeleteTask);

  $('#project-form').on('submit', handleAddTask);

  $(".lane").droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

    $( "#taskDueDate" ).datepicker({
        changeMonth: true,
        changeYear: true
      });

});
