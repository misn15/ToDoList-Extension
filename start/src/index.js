import axios from '../node_modules/axios';

// form fields
const form = document.querySelector('.form-data');
const apiKey = document.querySelector('.api-key');

// results
const errors = document.querySelector('.errors');
const loading = document.querySelector('.loading');
const results = document.querySelector('.result-container');
const projects = document.querySelector('.projects');
const clearBtn = document.querySelector('.clear-btn');

form.addEventListener('submit', (e) => handleSubmit(e));
clearBtn.addEventListener('click', (e) => reset(e));
init();

function init() {
	//if anything is in localStorage, pick it up
	const storedApiKey = localStorage.getItem('apiKey');

	//set icon to be generic green
	//todo

	if (storedApiKey === null) {
		//if we don't have the keys, show the form
		form.style.display = 'block';
		results.style.display = 'none';
		loading.style.display = 'none';
		clearBtn.style.display = 'none';
		errors.textContent = '';
	} else {
        //if we have saved keys/regions in localStorage, show results when they load
        displayProjects(storedApiKey);
		results.style.display = 'none';
		form.style.display = 'none';
		clearBtn.style.display = 'block';
	}
};

function reset(e) {
	e.preventDefault();
	//clear local storage for region only
	localStorage.removeItem('apiKey');
	//localStorage.removeItem('regionName');
	init();
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
	displayProjects(apiKey);
}

async function displayProjects(apiKey) {
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
				//let projects = Math.floor(response.data.data.carbonIntensity);
				console.log(response.data);


				loading.style.display = 'none';
				form.style.display = 'none';
				projects.textContent = 'success';
				results.style.display = 'block';
			});
	} catch (error) {
		console.log(error);
		loading.style.display = 'none';
		results.style.display = 'none';
		errors.textContent = 'Sorry, we have no data for the region you have requested.';
	}
}