// DOM Element References
const taskList = document.getElementById('taskList'); // Container for task items
const addForm = document.getElementById('addForm'); // Form for adding new tasks
const taskInput = document.getElementById('taskInput'); // Input field for new tasks
const errorMessage = document.getElementById('errorMessage'); // Element for error messages
const filterButtons = document.querySelectorAll('.filter-btn'); // Filter buttons (All/Completed/Pending)

// Initialize tasks array from localStorage or empty array if none exists
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
console.log(localStorage); // Debug: Check localStorage contents

/**
 * Renders tasks based on the current filter
 * @param {string} filter - Filter type: 'all', 'completed', or 'pending'
 */
function renderTasks(filter = 'all') {
  taskList.innerHTML = ''; // Clear current task list

  // Filter tasks based on the selected filter
  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'pending') return !task.completed;
    return true; // 'all' filter - return all tasks
  });

  // Show message if no tasks found
  if (filteredTasks.length === 0) {
    taskList.innerHTML = '<p class="no-tasks">No tasks found</p>';
    return;
  }

  // Create and append each task element
  filteredTasks.forEach((task, index) => {
    const taskElement = document.createElement('div');
    taskElement.className = `task ${task.completed ? 'completed' : ''}`;
    taskElement.dataset.id = task.id;
    
    // Task HTML template
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

    // Get references to task elements
    const checkbox = taskElement.querySelector('.task-checkbox');
    const editBtn = taskElement.querySelector('.edit-btn');
    const deleteBtn = taskElement.querySelector('.delete-btn');
    const editForm = taskElement.querySelector('.edit-form');
    const editInput = taskElement.querySelector('.edit-input');
    const saveBtn = taskElement.querySelector('.save-btn');

    // Add event listeners
    checkbox.addEventListener('change', () => toggleTaskComplete(task.id));
    editBtn.addEventListener('click', () => showEditForm(taskElement));
    deleteBtn.addEventListener('click', () => deleteTask(task.id));
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      updateTask(task.id, editInput.value);
    });
  });
}

/**
 * Adds a new task to the list
 * @param {string} text - The task description
 */
function addTask(text) {
  if (!text.trim()) {
    showError('Task cannot be empty');
    return;
  }

  // Create new task object
  const newTask = {
    id: Date.now(), // Unique ID based on timestamp
    text,
    completed: false
  };

  tasks.push(newTask);
  saveTasks();
  renderTasks(getCurrentFilter());
  taskInput.value = ''; // Clear input field
  hideError();
}

/**
 * Updates an existing task's text
 * @param {number} id - Task ID to update
 * @param {string} newText - New task description
 */
function updateTask(id, newText) {
  if (!newText.trim()) {
    showError('Task cannot be empty');
    return;
  }

  // Update task text in the tasks array
  tasks = tasks.map(task => 
    task.id === id ? { ...task, text: newText } : task
  );

  saveTasks();
  renderTasks(getCurrentFilter());
  hideError();
}

/**
 * Toggles a task's completed status
 * @param {number} id - Task ID to toggle
 */
function toggleTaskComplete(id) {
  tasks = tasks.map(task => 
    task.id === id ? { ...task, completed: !task.completed } : task
  );

  saveTasks();
  renderTasks(getCurrentFilter());
}

/**
 * Deletes a task from the list
 * @param {number} id - Task ID to delete
 */
function deleteTask(id) {
  tasks = tasks.filter(task => task.id !== id);
  saveTasks();
  renderTasks(getCurrentFilter());
}

/**
 * Shows the edit form for a task
 * @param {HTMLElement} taskElement - The task DOM element
 */
function showEditForm(taskElement) {
  const taskText = taskElement.querySelector('.task-text');
  const editForm = taskElement.querySelector('.edit-form');
  const editInput = taskElement.querySelector('.edit-input');
  const editBtn = taskElement.querySelector('.edit-btn');
  const deleteBtn = taskElement.querySelector('.delete-btn');

  // Hide normal view, show edit form
  taskText.style.display = 'none';
  editForm.style.display = 'flex';
  editBtn.style.display = 'none';
  deleteBtn.style.display = 'none';

  // Focus and select text in input
  editInput.focus();
  editInput.select();
}

/**
 * Saves tasks to localStorage
 */
function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

/**
 * Shows an error message
 * @param {string} message - Error message to display
 */
function showError(message) {
  errorMessage.textContent = message;
}

/**
 * Hides the error message
 */
function hideError() {
  errorMessage.textContent = '';
}

/**
 * Gets the currently active filter
 * @returns {string} The current filter ('all', 'completed', or 'pending')
 */
function getCurrentFilter() {
  const activeFilter = document.querySelector('.filter-btn.active');
  return activeFilter ? activeFilter.dataset.filter : 'all';
}

// Event Listeners

// Add new task form submission
addForm.addEventListener('submit', (e) => {
  e.preventDefault();
  addTask(taskInput.value);
});

// Filter button click handlers
filterButtons.forEach(button => {
  button.addEventListener('click', () => {
    filterButtons.forEach(btn => btn.classList.remove('active'));
    button.classList.add('active');
    renderTasks(button.dataset.filter);
  });
});

// Initial render
renderTasks();