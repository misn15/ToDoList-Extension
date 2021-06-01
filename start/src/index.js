import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');
const task = document.querySelector('.task-form');
const taskData = document.querySelector('.task-data');
const apiKey = document.querySelector('.api-key');
let item = null;

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const projects = document.querySelector('.projects');
const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', (e) => handleSubmit(e));
task.addEventListener('submit', (e) => register(e));
clearBtn.addEventListener('click', (e) => displayTaskForm(e));
init();

function init() {
	//if anything is in localStorage, pick it up
	const storedApiKey = localStorage.getItem('apiKey');
	task.style.display = 'none';

	if (storedApiKey === null) {
		//if we don't have the keys, show the form
		form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		task.style.display = 'none';
	} else {
        //if we have saved keys/regions in localStorage, show results when they load
        displayTasks(storedApiKey);
		results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
		task.style.display = 'none';
	}
};

// function reset(e) {
// 	e.preventDefault();
// 	//clear local storage for region only
// 	localStorage.removeItem('apiKey');
// 	//localStorage.removeItem('regionName');
// 	init();
// }

function displayTaskForm(e) {
	e.preventDefault();
	task.style.display = 'block';
	results.style.display = 'none';
	clearBtn.style.display = 'none';
}

function handleSubmit(e) {
	e.preventDefault();
	setUpUser(apiKey.value);
}

function setUpUser(apiKey) {
	localStorage.setItem('apiKey', apiKey);
	loading.style.display = 'block';
	errors.textContent = '';
	clearBtn.style.display = 'block';
	//make initial call
	displayTasks(apiKey);
}

async function displayTasks(apiKey) {
	try {
		await axios
			.get('https://api.todoist.com/rest/v1/tasks', {
				params: {
				},
				headers: {
					'Authorization': "Bearer "+ apiKey
				},
			})
			.then((response) => {

				loading.style.display = 'none';
				form.style.display = 'none';
				response.data.map(item => {
					let node = document.createElement("li"); 
					node.appendChild(document.createTextNode(item.content));
					projects.appendChild(node);
				});
				results.style.display = 'block';
			});
	} catch (error) {
		console.log(error);
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we have no data for the region you have requested.';
	}
}

async function register(e) {
	e.preventDefault();

	const formData = new FormData(task);
	const data = JSON.stringify(Object.fromEntries(formData));
	//taskData.textContent="task added";
	task.style.display = "none";
	taskData.style.display = 'block';
	const result = await createTask(data, apiKey.value);

	item = result;
  }

async function createTask(item, apiKey) {
	try {
	  const response = await fetch('https://api.todoist.com/rest/v1/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer "+ apiKey},
		body: item
		
	  });
	  return await response.json();
	} catch (error) {
	  return { error: error.message || 'Unknown error' };
	}
	
  }