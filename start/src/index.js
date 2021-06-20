import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');
const task = document.querySelector('.task-form');
const taskData = document.querySelector('.task-data');
const apiKey = document.querySelector('.api-key');
const apiInput = document.querySelector('.api-task');
const buttons = document.querySelector('.buttons');
const backBtn = document.querySelector('.back-btn');
const projects = document.getElementById('projects');
const clearBtn = document.querySelector('.clear-btn');
let item = null;

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');

form.addEventListener('submit', (e) => handleSubmit(e));
task.addEventListener('submit', (e) => register(e));
clearBtn.addEventListener('click', (e) => displayTaskForm(e));
backBtn.addEventListener('click', (e) => goBack(e));


init();

function init() {
	//if anything is in localStorage, pick it up
	const storedApiKey = localStorage.getItem('apiKey');
	
	task.style.display = 'none';
	taskData.style.display = 'none';
	results.style.display = 'none';	

	if (storedApiKey === null) {
		//if we don't have the keys, show the form
		form.style.display = 'block';
		loading.style.display = 'none';
		buttons.style.display = 'none';
	} else {
        //if we have saved keys/regions in localStorage, show results when they load
        displayTasks(storedApiKey);
		form.style.display = 'none';
		buttons.style.display = 'block';
	}
};

function displayTaskForm(e) {
	e.preventDefault();
	task.style.display = 'block';
	results.style.display = 'none';
	buttons.style.display = 'none';
}

function handleSubmit(e) {
	e.preventDefault();
	setUpUser(apiKey.value);
}

function setUpUser(apiKey) {
	localStorage.setItem('apiKey', apiKey);
	loading.style.display = 'block';
	errors.textContent = '';
	buttons.style.display = 'block';
	//make initial call
	displayTasks(apiKey);
}

async function displayTasks(apiKey) {
	let apiCode = apiKey;
	if (apiKey === '') {
		apiCode = apiInput.value;	
	} else {
		apiCode = apiKey;
	}
	try {
		await axios
			.get('https://api.todoist.com/rest/v1/tasks', {
				params: {
				},
				headers: {
					'Authorization': "Bearer "+ apiCode
				},
			})
			.then((response) => {				
				projects.innerHTML = '';
				loading.style.display = 'none';
				form.style.display = 'none';
				response.data.map(item => {
					let checkbox = document.createElement("input");
					let br = document.createElement("br");
					checkbox.setAttribute("type", "checkbox");
					checkbox.id = item.id;
					checkbox.name = "task";
					checkbox.value = item.id;
					let label = document.createElement('label');
					label.htmlFor = item.id;
					label.appendChild(document.createTextNode(item.content));	
					checkbox.addEventListener("click", function() {label.style.setProperty('text-decoration', 'line-through');	
					completeTask(checkbox.value, apiKey)});			
					projects.appendChild(checkbox);
					projects.appendChild(label);
					projects.appendChild(br);
	
				});
				results.style.display = 'block';
			});	
	} 
	 catch (error) {		
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we have no data for the region you have requested.';
	}
}

function goBack(e) {
	e.preventDefault();
	results.style.display = 'none';
	taskData.style.display = 'none';
	buttons.style.display = 'block';
	displayTasks(apiKey.value);
}


async function register(e) {
	e.preventDefault();

	const formData = new FormData(task);
	const data = JSON.stringify(Object.fromEntries(formData));
	task.style.display = "none";
		
	const result = await createTask(data, apiKey.value);
	taskData.style.display = 'block';
	
	item = result;
  }

async function createTask(item, apiKey) {
	let apiCode = apiKey;
	if (apiKey === '') {
		apiCode = apiInput.value;	
	} else {
		apiCode = apiKey;
	}
	try {
	  const response = await fetch('https://api.todoist.com/rest/v1/tasks', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' , 'Authorization': "Bearer "+ apiCode},
		body: item	
	  });
	  return await response.json();
	} catch (error) {
	  return { error: error.message || 'Unknown error' };
	}	
  }


  async function completeTask(data, apiKey) {
	const headers = {'Content-Type': 'application/json','Authorization': "Bearer "+ apiKey};
	const url = 'https://api.todoist.com/rest/v1/tasks/'+data+'/close';
	try {
	  await axios.post(url,null,
		{headers: headers
	}) 
	  .then((response) => {
		return response.data
	});
	}	 catch (error) {
		return { error: error.message || 'Unknown error' };
  }
}


