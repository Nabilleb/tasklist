const taskList = document.getElementById('taskList');
const addForm = document.getElementById("addForm");
const taskInput = document.getElementById("taskInput");
const errorMessage = document.getElementById("errorMessage");
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function showError(message){
    errorMessage.textContent = message;
}

function hideError(){
    errorMessage.textContent = '';
}

function renderTasks(filter = 'all') {
  taskList.innerHTML = '';

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true;
  });

  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
    return;
  }

  filteredTasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;

    taskElement.innerHTML = `
      <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
      <p class="task-text">${task.text}</p>
      <div class="task-actions">
        <button class="task-btn edit-btn">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
          </svg>
        </button>
        <button class="task-btn delete-btn">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          </svg>
        </button>
      </div>
      <form class="edit-form">
        <input type="text" class="edit-input" value="${task.text}">
        <button type="submit" class="save-btn task-btn">
          <svg class="icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 6 9 17 4 12"></polyline>
          </svg>
        </button>
      </form>
    `;

    taskList.appendChild(taskElement);

    const checkbox = taskElement.querySelector('.task-checkbox');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    const editForm = taskElement.querySelector('.edit-form');
    const editInput = taskElement.querySelector('.edit-input');
    const saveBtn = taskElement.querySelector('.save-btn');

    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
    editBtn.addEventListener('click', () => showEditForm(taskElement));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateTask(task.id, editInput.value);
    });
  });
}


