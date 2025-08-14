const taskList = document.getElementById('taskList');
const addForm = document.getElementById("addForm");
const taskInput = document.getElementById("taskInput");
const errorMessage = document.getElementById("errorMessage");
const filterButtons = document.querySelectorAll('.filter-btn');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function showError(message){
    errorMessage.textContent = message
}