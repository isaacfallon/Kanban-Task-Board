// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

function readTasksFromStorage() {
  let tasks = localStorage.getItem("tasks");
  if (!tasks) {
    return [];
  }
  let tasksParsed = JSON.parse(tasks);
  return tasksParsed;
}

function saveTasksToStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Todo: create a function to generate a unique task id
function generateTaskId() {
  // We return a randomly generated, 36 character long string 
  // to be called later when a task is created. 
  return crypto.randomUUID();
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  //The taskCard is created by creating it as a 'div' HTML element.
  const taskCard = $('<div>');
// We then attach some bootstrap card classes as well as the 'draggable' class
  // to allow it to be draggable when we call the jquery draggable functionality later on. 
  taskCard.addClass('card project-card draggable my-3');
    // We also provide the card with its own 'data-project-id' attribute which we set later on.
  taskCard.attr('data-project-id', task.id);

   // A similar 'div' element is created for the header and assigned to the input title of the task. 
  const cardHeader = $('<div>');
  cardHeader.addClass('card-header h4');
  cardHeader.text(task.title);

  // The card's body is created with a 'div' element for the main content. 
  const cardBody = $('<div>');
  cardBody.addClass('card-body');

  // We create a 'p' element for the task's due date input.
  const cardDate = $('<p>');
  cardDate.addClass('card-text');
  cardDate.text(task.dueDate);

  // A similar 'p' element for the task's description input is created.
  const cardDesc = $('<p>');
  cardDesc.addClass('card-text');
  cardDesc.text(task.description);

  // A 'button' element is also added so we can remove tasks with the handleDeleteTask function further down. 
  const cardDeleteButton = $('<button>');
  cardDeleteButton.addClass('btn btn-danger delete');
  cardDeleteButton.text('delete');
   // We set an id for the button we can later compare to the card button to ensure the correct card is deleted. 
  cardDeleteButton.attr('data-project-id', task.id);

  // The due date, description and delete buttons are appended to the card body. 
  cardBody.append(cardDate);
  cardBody.append(cardDesc);
  cardBody.append(cardDeleteButton);

  // The card header and body is then appended to the main task card. 
  // This creates the overall design of the card. 
  taskCard.append(cardHeader);
  taskCard.append(cardBody);

  // An if-statement is used to only with the condition that the task's dueDate exists and the status is not 'done'.
  if (task.dueDate && task.status !== 'done') {
    // We assign a variable 'now' to the call of 'dayjs' with no parameters to set it to the current date and time. 
    const now = dayjs();
    // We assign a variable 'taskDueDate' to the task's due date in the format of 'DD/MM/YYYY'.
    const taskDueDate = dayjs(task.dueDate, 'DD/MM/YYYY');

    // We assign a variable 'sevenDaysAway' to a day that is seven days from today using the 'now' variable and adding 7 days. 
    // PLEASE NOTE: This is optional but I prefer the functionality it allows below. 
    let sevenDaysAway = now.add(7, 'day');
     // We then assign a variable 'isBetween' to the isBetween js plugin extension. 
    const isBetween = window.dayjs_plugin_isBetween;
     // We then extend the dayjs functionality by setting the 'isBetween' variable as a parameter. 
    dayjs.extend(isBetween);

    // The following if and else-if statements dictate the colour of the card based on how close the due date is to today. 
    if (dayjs(taskDueDate).isBetween(now, sevenDaysAway, 'day', "[)")) {
      // If the task's due date falls between now and seven days from now 
      // (as in - the due date is approaching), the card's colour is set to yellow. 
      taskCard.addClass('bg-warning text-white');
      // Else, if the current date is after the 'due date' (as in - the project is overdue),
      // then the card's colour is set to red. We also add a light-border to the existing red delete button so it is visible.  
    } else if (now.isAfter(taskDueDate, 'day')) {
      taskCard.addClass('bg-danger text-white');
      cardDeleteButton.addClass('border-light');
    }
  // We then return the taskCard so we can display it in later functions. 
  return taskCard;

}

  return taskCard;

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  const tasks = readTasksFromStorage();

  // We use the empty() method to empty existing project cards out of the lanes. 
  const todoList = $('#todo-cards');
  todoList.empty();

  const inProgressList = $('#in-progress-cards');
  inProgressList.empty();

  const doneList = $('#done-cards');
  doneList.empty();

  // We then loop through the taskList, creating a card for each lane depending on it's status 
  // (by appending the card to the lane). 
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
   // We apply the Jquery draggable functionality to any element with the 'draggable' class (the cards in this case).
  $(".draggable").draggable({
    opacity: 0.5,
    zIndex: 100,

    // I'm not 100% certain on how the code below works as I sourced it from the mini-project task -
    // (see my README.MD file for specifics here).

    // From what I understand, the following code creates a clone of the card so the user can 
    // visibly see how the card is being moved between lanes. 
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
  // We start by preventing the browser's default bevaviour overwriting our attempt to add a task. 
  event.preventDefault();

  // An object is created to contain the user input for each task. 
  const newTask = {
    // The 'generateTaskId' function is called to generate the ID for each task. 
    id: generateTaskId(),
    title: $('#taskTitle').val(),
    dueDate: $('#taskDueDate').val(),
    description: $('#taskDescription').val(),
    //Each task is set default to 'to-do' so it goes straight to the 'to-do' lane.
    status: 'to-do',
  };

  // We read get any existing tasks from storage and then push the new task to the array of existing tasks. 
  const tasks = readTasksFromStorage();
  tasks.push(newTask);

  // We then save all tasks to local storage and render all tasks to their lanes 
  // by calling the respective functions. 
  saveTasksToStorage(tasks);
  renderTaskList();

  // We then empty the input fields for if the user wants to add another task. 
  $('#taskTitle').val('');
  $('#taskDueDate').val('');
  $('#taskDescription').val('');

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

  // We assign the attribute of 'data-project-id' for the object 
  // attached to the delete task function's parameter to the variable 'taskId'.
  // We then assign the items in local storage to the variable 'tasks'. 
  const taskId = $(this).attr('data-project-id');
  const tasks = readTasksFromStorage();

  // We loop through the tasks array and remove the project with the matching id.
  for (let i = 0; i < tasks.length; i++) {
    if (tasks[i].id == taskId) {
      tasks.splice([i], 1);
    }
  }
  // Then we save the remaining tasks to local storage and render them to the screen. 
  saveTasksToStorage(tasks);
  renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

  // We assign the items in local storage to the variable 'tasks'. 
  const tasks = readTasksFromStorage();
  // We then get the project id from the event and assign it to the variable 'taskId'.
  const taskId = ui.draggable[0].dataset.projectId;
  // W then get the id of the lane that the card was dropped into and assign it to the variable 'newStatus'.
  const newStatus = event.target.id;

  // Loop through the tasks, find the project card by the `id` and update the project status.
  for (i of tasks) {
    if (i.id === taskId) {
      i.status = newStatus;
    }
  }

  // The local storage is set for the tasks in a string format then the tasks are rendered to the screen.
  localStorage.setItem('tasks', JSON.stringify(tasks));
  renderTaskList();

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, 
// and make the due date field a date picker
$(document).ready(function () {

  // First, the task list is rendered to the screen. 
  renderTaskList();

  // Then, the delete button event listener is set. 
  // Event delegation is used to call the 'handleDeleteTask' function. 
  $('.swim-lanes').on('click', '.delete', handleDeleteTask);

  // The add form event listener is set. 
  // Event delegation is used to call the 'handleAddTask' function. 
  $('#project-form').on('submit', handleAddTask);

  // The lanes are set as droppable with the jQuery droppable functionality
  // to accept 'draggable' elements and run the 'handleDrop' function.  
  $(".lane").droppable({
    accept: '.draggable',
    drop: handleDrop,
  });

    // The datepicker jQuery functionality is set for the due date field 
    // while showing month and year dropdowns. 
    $( "#taskDueDate" ).datepicker({
        changeMonth: true,
        changeYear: true
      });

});
