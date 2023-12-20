interface List {
	title: string;
	required: string[];
	steps: string[];
}

class ListManager {
	constructor() {
		this.allEventListeners();
	}

	private clearForm() {
		const titleInput = document.querySelector('#title') as HTMLInputElement;
		const requiredInput = document.querySelector('#required') as HTMLTextAreaElement;
		const stepsInput = document.querySelector('#steps') as HTMLTextAreaElement;

		titleInput.value = '';
		requiredInput.value = '';
		stepsInput.value = '';
	}

	generateList() {
		const title = document.querySelector('#title') as HTMLInputElement;
		const required = document.querySelector('#required') as HTMLTextAreaElement;
		const steps = document.querySelector('#steps') as HTMLTextAreaElement;

		const listDiv = document.createElement('div');
		listDiv.classList.add('listDiv');
		listDiv.innerHTML = `
            <h2>${title.value}</h2>
            <ul>${required.value.split('\n').map((item) => `<li>${item}</li>`).join('')}</ul>
            <ol>${steps.value.split('\n').map((item) => `<li>${item}</li>`).join('')}</ol>
            <button class="deleteButton">Delete List</button>
        `;

		const listContainer = document.querySelector('#listContainer');
		if (listContainer) {
			listContainer.appendChild(listDiv);

			const listData: List = {
				title: title.value,
				required: required.value.split('\n'),
				steps: steps.value.split('\n'),
			};

			const storedLists = JSON.parse(localStorage.getItem('lists') || '[]') as List[];
			storedLists.push(listData);
			localStorage.setItem('lists', JSON.stringify(storedLists));

			this.clearForm();

			const editButton = document.createElement('button');
			editButton.textContent = 'Edit List';
			editButton.addEventListener('click', () => this.editList(listDiv, listData));
			listDiv.appendChild(editButton);
		}
	}

	editList(listDiv: HTMLDivElement, list: List) {
		const titleInput = document.querySelector('#title') as HTMLInputElement;
		const requiredInput = document.querySelector('#required') as HTMLTextAreaElement;
		const stepsInput = document.querySelector('#steps') as HTMLTextAreaElement;

		titleInput.value = list.title;
		requiredInput.value = list.required.join('\n');
		stepsInput.value = list.steps.join('\n');

		const listForm = document.querySelector('#listForm');
		if (listForm) {
			listForm.classList.remove('hidden');
		}

		const listContainer = document.querySelector('#listContainer');
		if (listContainer) {
			listContainer.removeChild(listDiv);
			this.removeFromLocalStorage(listDiv);
		}
	}

	deleteList(button: HTMLElement) {
		const confirmAction = window.confirm('Are you sure you want to perform this action?');
		if (confirmAction) {
			const listDiv = button.closest('.listDiv') as HTMLDivElement;
			const listContainer = document.querySelector('#listContainer');

			if (listContainer && listDiv) {
				listContainer.removeChild(listDiv);
				this.removeFromLocalStorage(listDiv);

				if (listContainer.children.length === 0) {
					const listForm = document.querySelector('#listForm');
					if (listForm) {
						listForm.classList.remove('hidden');
					}
				}
			}
		}
	}

	private removeFromLocalStorage(listDiv: HTMLDivElement) {
		const storedLists = JSON.parse(localStorage.getItem('lists') || '[]') as List[];
		const listTitle = listDiv.querySelector('h2')?.textContent;
		const updatedLists = storedLists.filter((list) => list.title !== listTitle);
		localStorage.setItem('lists', JSON.stringify(updatedLists));
	}

	filterLists(searchTerm: string) {
		const storedLists = JSON.parse(localStorage.getItem('lists') || '[]') as List[];
		const listContainer = document.querySelector('#listContainer');

		if (listContainer) {
			listContainer.innerHTML = '';

			storedLists.forEach(list => {
				if (
					list.title.toLowerCase().includes(searchTerm)
				) {
					this.displayList(list);
				}
			});
		}
	}

	displayList(list: List) {
		const listDiv = document.createElement('div');
		listDiv.classList.add('listDiv');
		listDiv.innerHTML = `
            <h2>${list.title}</h2>
            <ul>${list.required.map((item) => `<li>${item}</li>`).join('')}</ul>
            <ol>${list.steps.map((item) => `<li>${item}</li>`).join('')}</ol>
            <button class="deleteButton">Delete List</button>
        `;

		const listContainer = document.querySelector('#listContainer');
		if (listContainer) {
			listContainer.appendChild(listDiv);

			const editButton = document.createElement('button');
			editButton.textContent = 'Edit List';
			editButton.addEventListener('click', () => this.editList(listDiv, list));
			listDiv.appendChild(editButton);
		}
	}

	allEventListeners() {
		const searchInput = document.querySelector('#searchInput') as HTMLInputElement;
		if (searchInput) {
			searchInput.addEventListener('input', () => this.filterLists(searchInput.value.toLowerCase()));
		}

		const generateButton = document.querySelector('#generateButton');
		if (generateButton) {
			generateButton.addEventListener('click', () => this.generateList());
		}

		document.addEventListener('click', (event) => {
			const deleteButton = event.target as HTMLElement;
			if (deleteButton.matches('.deleteButton')) {
				this.deleteList(deleteButton);
			}
		});

	}
}

window.onload = () => {
	new ListManager();
};
