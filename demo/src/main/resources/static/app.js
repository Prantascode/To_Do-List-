document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');
    const filterAll = document.getElementById('filter-all');
    const filterCompleted = document.getElementById('filter-completed');
    const filterPending = document.getElementById('filter-pending');

    let tasks = [];

    // Fetch all tasks on page load
    fetchTasks();

    // Add a new task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const title = taskInput.value.trim();
        if (title) {
            await addTask({ title, completed: false });
            taskInput.value = '';
            fetchTasks();
        }
    });

    // Fetch all tasks from the backend
    async function fetchTasks() {
        const response = await fetch('/tasks');
        tasks = await response.json();
        renderTasks(tasks); // Render all tasks by default
    }

    // Add a new task to the backend
    async function addTask(task) {
        await fetch('/tasks', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        });
    }

    // Delete a task from the backend
    async function deleteTask(id) {
        await fetch(`/tasks/${id}`, {
            method: 'DELETE',
        });
        fetchTasks();
    }

    // Toggle task completion status
    async function toggleTaskCompletion(id, completed) {
        await fetch(`/tasks/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ completed: !completed }),
        });
        fetchTasks();
    }

    // Render tasks to the DOM
    function renderTasks(tasksToRender) {
        taskList.innerHTML = '';
        tasksToRender.forEach(task => {
            const li = document.createElement('li');
            if (task.completed) {
                li.classList.add('completed');
            }

            // Task content
            const taskContent = document.createElement('div');
            taskContent.classList.add('task-content');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = task.completed;
            checkbox.addEventListener('change', () => toggleTaskCompletion(task.id, task.completed));

            const span = document.createElement('span');
            span.textContent = task.title;

            taskContent.appendChild(checkbox);
            taskContent.appendChild(span);

            // Actions
            const actions = document.createElement('div');
            actions.classList.add('actions');

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i>';
            deleteButton.addEventListener('click', () => deleteTask(task.id));

            actions.appendChild(deleteButton);

            li.appendChild(taskContent);
            li.appendChild(actions);
            taskList.appendChild(li);
        });
    }

    // Filter tasks
    filterAll.addEventListener('click', () => renderTasks(tasks)); // Show all tasks
    filterCompleted.addEventListener('click', () => renderTasks(tasks.filter(task => task.completed))); // Show completed tasks
    filterPending.addEventListener('click', () => renderTasks(tasks.filter(task => !task.completed))); // Show pending tasks
});