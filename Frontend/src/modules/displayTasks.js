function displayTasks(tasks) {
    const toDoContainer = document.querySelector('.toDoContainer');
    const progressContainer = document.querySelector('.progressContainer');
    const doneContainer = document.querySelector('.doneContainer');

    toDoContainer.innerHTML = '';
    progressContainer.innerHTML = '';
    doneContainer.innerHTML = '';
    
    createAndAppend('h2', 'To do', toDoContainer);
    createAndAppend('h2', 'In Progess', progressContainer);
    createAndAppend('h2', 'Done', doneContainer);

    for (const [key, value] of Object.entries(tasks)) {
        createTask(value, toDoContainer, progressContainer, doneContainer);
    }
}

function createTask(value, toDoContainer, progressContainer, doneContainer) {
    let taskId = value.id;

    const taskCard = createAndAppend('div', '', toDoContainer);
    taskCard.classList.add('taskCard');
    taskCard.id = taskId;
    createAndAppend('h4', value.task, taskCard);
    
    const category = value.category.trim().toLowerCase(); 
    addBackgroundColor(taskCard, category);

    renderTaskStatus(value.status, taskCard, value.assigned, toDoContainer, progressContainer, doneContainer);
}

function addBackgroundColor(taskCard, category) {
    if (category === 'dev front end') taskCard.classList.add('frontEndColor');
     
    else if (category === 'dev back end') {
        taskCard.classList.remove('frontEndColor');
        taskCard.classList.add('backEndColor');
    } 
    else {
        taskCard.classList.remove('frontEndColor', 'backEndColor');
        taskCard.classList.add('uxColor');
    }
}

function createInput(container, attributes = {}) {
    const input = createAndAppend('input', '', container, attributes);
    input.classList.add('assignedInput');

    return input;
}

function renderTaskStatus(status, taskCard, assigned, todoContainer, progressContainer, doneContainer) {
    
    if (status === 'to do') {
        const assignForm = createAndAppend('form', '', taskCard);
        assignForm.classList.add('assignForm');
    
         createInput(assignForm, {
            type: 'text',
            name: 'assigned',
            placeholder: 'Enter name',
            class: 'assigned-input',
            required: true
        });
       
        createAndAppend('button', 'Assign >>', assignForm);
        todoContainer.append(taskCard);
    } 
    else if (status === 'progress') {
        createAndAppend('p', `${assigned}`, taskCard)
        const btnDone = createAndAppend('button', 'Done >>', taskCard)
        btnDone.classList.add('btnDone')

        progressContainer.append(taskCard);
    } 
    else {
        createAndAppend('p', `${assigned}`, taskCard)
       const btnRemove = createAndAppend('button', 'Remove X', taskCard)
       btnRemove.classList.add('btnRemove')
       
       doneContainer.append(taskCard);
    }
}

function createAndAppend(type, content, container, attributes = {}){
    const element = document.createElement(type)
    container.append(element)

    if (type === 'input') element.value = content;
    
    else element.innerText = content;

    for (const [key, value] of Object.entries(attributes)) {
        element.setAttribute(key, value);
    }
    return element;
}

export{displayTasks}