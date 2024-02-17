// document.addEventListener('DOMContentLoaded', function() {

	let draggedTask = null;
	let sourceCategory = null;

	const showtask = document.createElement('img');

	// Load tasks from localStorage when the page is loaded
	window.addEventListener('load', loadTasksFromLocalStorage);

		
	function toggleShowTasks(event) {

		const showTaskIcon = event.target; // Get the clicked status icon (the <img> element)
	//	const showtask = document.createElement('img');
		const completedTasks = document.querySelectorAll('.task.completed');
		
		if (showTaskIcon.src.endsWith('toggle-on.png')) {
			showTaskIcon.src = 'toggle-off.png';
			showtask.alt = 'Click to hide completed tasks';
			showtask.title = 'Click to hide completed tasks'; 
			completedTasks.forEach(task => {
			  task.style.display = 'flex';
			});
		} else {
			showTaskIcon.src = 'toggle-on.png';
			showtask.alt = 'Click to show completed tasks';
			showtask.title = 'Click to show completed tasks'; 
			completedTasks.forEach(task => {
			  task.style.display = 'none';
			});        
		}
	}

	function addTask(categoryId, event) {
		const taskInput = event.target;
		if (event.key === 'Enter') {
			const taskName = taskInput.value;
			if (taskName.trim() !== '') {
				const newTask = document.createElement('div');
				newTask.className = 'task';

				const trashIcon = document.createElement('img');
				trashIcon.className = 'trash-icon';
				trashIcon.src = 'trash.png'; // Set the initial trash icon
				trashIcon.alt = 'Delete the task';
				trashIcon.title = 'Delete the task'; 

				trashIcon.addEventListener('click', trashTask);
				newTask.appendChild(trashIcon);
				
				const taskText = document.createElement('span');
				taskText.className = 'task-text';
				taskText.textContent = taskName;
				newTask.appendChild(taskText);
				newTask.draggable = true;
				newTask.addEventListener('dragstart', dragStart);
				
				taskText.addEventListener('click', startEditingTask); // Add event listener for editing
				
				taskInput.parentNode.querySelector('.task-list').appendChild(newTask);
				taskInput.value = '';
				
				const statusIcon = document.createElement('img');
				statusIcon.className = 'status-icon';
				statusIcon.src = 'not-completed.png'; // Set the initial status icon
				statusIcon.alt = 'Mark completed';
				statusIcon.title = 'Mark completed'; 
				statusIcon.addEventListener('click', toggleTaskStatus);
				newTask.appendChild(statusIcon);
				
				updateTaskCount(categoryId);
				saveTasksToLocalStorage(); // Save tasks to localStorage
			}
		}
	}

	// Drag-and-drop functions
	function dragStart(event) {
		draggedTask = event.target;
		sourceCategory = event.target.closest('.column'); // Get the closest parent element with class 'column'
		event.dataTransfer.setData('text', event.target.textContent);
		event.target.style.opacity = '1.0';
	}

	function allowDrop(event) {
		event.preventDefault();
	}

	function drop(event, categoryId) {
		event.preventDefault();
		const taskName = event.dataTransfer.getData('text');
		event.target.querySelector('.task-list').appendChild(draggedTask);
		updateTaskCount(categoryId);
		updateTaskCount(sourceCategory.id);
		saveTasksToLocalStorage(); // Save tasks to localStorage
	}

	function updateTaskCount(categoryId) {
		const taskList = document.getElementById(categoryId).querySelector('.task-list');
		const counter = document.getElementById(categoryId).querySelector('.counter');
		counter.textContent = taskList.children.length;
	}

	function saveTasksToLocalStorage() {
		const columns = document.querySelectorAll('.column');
		const tasks = {};

		columns.forEach(column => {
			const categoryId = column.id;
			const taskList = column.querySelector('.task-list');
			const taskObjects = Array.from(taskList.children).map(taskElement => {
				const taskText = taskElement.querySelector('.task-text').textContent;
				const isCompleted = taskElement.classList.contains('completed');
				return { text: taskText, completed: isCompleted };
			});

			tasks[categoryId] = taskObjects;
		});

		localStorage.setItem('tasks', JSON.stringify(tasks));
	}

	function loadTasksFromLocalStorage() {
		const tasks = JSON.parse(localStorage.getItem('tasks'));
		if (tasks) {
			Object.keys(tasks).forEach(categoryId => {
				const column = document.getElementById(categoryId);
				if (column) {
					const taskList = column.querySelector('.task-list');
					tasks[categoryId].forEach(task => {
						const newTask = document.createElement('div');
						const taskText = document.createElement('span');
						const trashIcon = document.createElement('img');
						const statusIcon = document.createElement('img');

						newTask.className = 'task';
						newTask.draggable = true;
						newTask.addEventListener('dragstart', dragStart);

						taskText.className = 'task-text';
						taskText.textContent = task.text; // Set the task name from the saved data
						taskText.addEventListener('click', startEditingTask); 

						trashIcon.className = 'trash-icon';
						trashIcon.src = 'trash.png'; // Set the initial trash icon
						trashIcon.alt = 'Delete the task';
						trashIcon.title = 'Delete the task'; 
						trashIcon.addEventListener('click', trashTask);

						statusIcon.className = 'status-icon';
						statusIcon.src = task.completed ? 'completed.png' : 'not-completed.png'; // Set the initial status icon based on completed property
						statusIcon.alt = task.completed ? 'Mark uncomplated' : 'Mark completed';
						statusIcon.title = task.completed ? 'Mark uncomplated' : 'Mark completed';
						statusIcon.addEventListener('click', toggleTaskStatus);

						newTask.appendChild(trashIcon);
						newTask.appendChild(taskText);
						newTask.appendChild(statusIcon);

						if (task.completed) {
							newTask.classList.add('completed'); // Add 'completed' class if the task is completed
						}

						taskList.appendChild(newTask);
					});
					updateTaskCount(categoryId);
				}
			});
			
			// Create and configure the toggle images
			const showTaskIcon = document.querySelector('.showtask-icon');
			// const showtask = document.createElement('img');
			const completedTasks = document.querySelectorAll('.task.completed');

			showtask.src = 'toggle-on.png';
			showtask.alt = 'Click to show completed tasks';
			showtask.title = 'Click to show completed tasks'; 
			showtask.style.cursor = 'pointer'; // Set cursor to pointer for indicating clickability
			showtask.addEventListener('click', toggleShowTasks); 
			completedTasks.forEach(task => {
					task.style.display = 'none';
		});

	showTaskIcon.appendChild(showtask);
			
		}
	}

	function toggleTaskStatus(event) {
		const statusIcon = event.target; // Get the clicked status icon (the <img> element)
		const task = statusIcon.parentElement; // Get the parent element of the status icon, which is the task <div>

		// Toggle the status icon based on its current source
		if (statusIcon.src.endsWith('not-completed.png')) {
			statusIcon.src = 'completed.png';
			task.classList.add('completed'); // Remove 'completed' class from the task <div>
		} else {
			statusIcon.src = 'not-completed.png';
			task.classList.remove('completed'); // Add 'completed' class to the task <div>
		}

		saveTasksToLocalStorage();
		// Save tasks to localStorage when the task status is toggled
	}

	function trashTask(event) {
		const trashIcon = event.target; // Get the clicked status icon (the <img> element)
		const taskElement = trashIcon.parentElement; // Get the parent element of the status icon, which is the task <div>
		const taskList = taskElement.parentElement; 
		taskList.removeChild(taskElement);
		updateTaskCount(taskList.parentElement.id);
		saveTasksToLocalStorage();
	}

	function startEditingTask(event) {
		const taskText = event.target;
		const taskInput = document.createElement('input');
		taskInput.className = 'task-input-edit'; // Add a class to the input field
		taskInput.value = taskText.textContent;
		initialTaskText = taskText.textContent;

		function saveTask() {
			taskText.textContent = taskInput.value;
			taskText.addEventListener('click', startEditingTask);
			saveTasksToLocalStorage();
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('keydown', handleKeyPress);
		}

		function cancelEdit() {
			taskText.textContent = initialTaskText;
			taskText.addEventListener('click', startEditingTask);
			taskText.removeChild(taskInput); // Remove the input field
			document.removeEventListener('click', handleOutsideClick);
			document.removeEventListener('keydown', handleKeyPress);
		}

		function handleOutsideClick(event) {
			if (!taskText.contains(event.target)) {
				cancelEdit();
			}
		}

		function handleKeyPress(event) {
			if (event.key === 'Enter') {
				saveTask();
			} else if (event.key === 'Escape') {
				cancelEdit();
			}
		}

		taskInput.addEventListener('keyup', function (event) {
			if (event.key === 'Enter') {
				saveTask();
			} else if (event.key === 'Escape') {
				cancelEdit();
			}
		});

		taskText.textContent = '';
		taskText.appendChild(taskInput);
		taskInput.focus();
		taskText.removeEventListener('click', startEditingTask);

		document.addEventListener('click', handleOutsideClick);
		document.addEventListener('keydown', handleKeyPress);
	}
// });

