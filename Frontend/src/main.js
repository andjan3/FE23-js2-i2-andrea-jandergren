/** 
* Scrumboard - inlämningsuppgift 2 i Javascript 2
* Av Andréa Jandergren, FE23

* Scrumboard med följande funktioner:

*- Lägga till en uppgift
*- Assigna en person till uppgiften
*- Markera när en uppgift är slutförd
*- Radera uppgift

- När en ny uppgift läggs till får den statusen "to do" som standard. Varje uppgift har ett unikt ID. Backgrundsfärgen avgörs beroende på vilket val som angetts i rullgardinsmenyn och styrs av CSS-klasser.
- I "to do-kolumnen" skapas ett formulär där användaren kan assigna en person. När någon blivit assignad får uppgiften status "in progress".
- När done-knappen klickas i får uppgiften status "done" och flyttas till respektive kolumn där knappen "remove" skapas. Först här kan uppgiften tas bort.

- Statusen to do bestäms i backend handledatabase, resterande statusar hanteras i respektive objekts property i front end main.

**/
import { displayTasks } from "./modules/displayTasks.js";
import { getTasks, postTask, patchTask, delTask } from "./modules/fetchTasks.js";


getTasks().then((tasks) => {
    displayTasks(tasks);
});

const formTaskEl = document.querySelector('.formTask')

formTaskEl.addEventListener('submit', async (event) => {
    event.preventDefault();

    const formData = new FormData(formTaskEl);
    const taskValue = formData.get('task');
    const categoryValue = formData.get('category')
    const task = isNaN(taskValue) ? taskValue : parseFloat(taskValue);
    const category = isNaN(categoryValue) ? categoryValue : parseFloat(categoryValue);

    const content = {
        task: task,
        category: category
    };

    try {
        await postTask(content);
        const tasks = await getTasks();
        displayTasks(tasks);
    } catch (error) {

        if(parseFloat(taskValue)){
            console.error('Error in formTaskEl input ', error);
            alert('Numeric values are not allowed, please try again!')

        }
        
        else{
            console.error('Error in formTaskEl submit', error);
            alert('Something went wrong, please try again later')
            return;
        } 
        
    }

    formTaskEl.reset();
});

const taskContainer = document.querySelector('.taskContainer')
        
taskContainer.addEventListener('submit', async (event) => {
    const {target} = event;

    if (target && target.classList.contains('assignForm')) {
        event.preventDefault();
        
        const taskId = target.closest('div').id;
        const formData = new FormData(target);
        const assignedValue = formData.get('assigned');
        const assigned = isNaN(assignedValue) ? assignedValue : parseFloat(assignedValue);

        const content = {
            status: "progress",
            assigned: assigned
        };

        try {
            await patchTask(taskId, content);
            const tasks = await getTasks();
            displayTasks(tasks);
        } catch (error) {
            if(parseFloat(assignedValue)){
                console.error('Error in assignForm input ', error);
                alert('Numeric values are not allowed, please try again!')
    
            }
            
            else{
                console.error('Error in assignForm submit', error);
                alert('Something went wrong, please try again later')
                return;
            } 
            
        }

       target.reset();
    }
});


taskContainer.addEventListener('click', async (event) => {
    const {target} = event;
    const btnDone = target.closest('.btnDone');
    const btnRemove = target.closest('.btnRemove');

    if (btnDone) {
        const taskId = btnDone.closest('div').id;
        const taskCard = btnDone.closest('.taskCard');
        const assignedElement = taskCard.querySelector('p');

        const assignedText = assignedElement ? assignedElement.innerText.trim() : '';

        let content = {
            status: "done",
            assigned: assignedText
        };

        try {
            await patchTask(taskId, content);
            const tasks = await getTasks();
            displayTasks(tasks);
        } catch (error) {
            console.error('Error in btnDone click:', error);
        }

    } else if (btnRemove) {
        const taskId = btnRemove.closest('div').id;

        try {
            await delTask(taskId);
            const tasks = await getTasks();
            displayTasks(tasks);
        } catch (error) {
            console.error('Error in btnRemove click:', error);
        }
    }
});

