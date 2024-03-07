const baseUrl = 'http://localhost:3000/api/';
const taskQueries = 'tasks'
const patchQueries = 'tasks?id='
const removeQueries = 'removetask?id='

const header = {
    "content-type": "application/json; charset=UTF-8"
};

async function getTasks(){
    const url = baseUrl + taskQueries;

    const res = await fetch(url)

    if (!res.ok) {
        throw new Error(`Failed to fetch tasks. Status: ${res.status}`);
    }
    
    const tasks = await res.json()
    return tasks;
}

async function postTask(content){
    const url = baseUrl + taskQueries;

    options = {
        method: "POST",
        body: JSON.stringify(content),
        headers: header
    }

    const res = await fetch(url, options)
    if (!res.ok) {
        throw new Error(`Failed to post task. Status: ${res.status}`);
    }

    const tasks = await res.json()
    return tasks;
}

async function patchTask(taskId, content){
    const url = baseUrl + patchQueries + `${taskId}`

    const options = {
        method: 'PATCH',
        body: JSON.stringify(content),
        headers: header
    };

    const res = await fetch(url, options)
    if (!res.ok) {
        throw new Error(`Failed to patch task. Status: ${res.status}`);
    }
    const tasks = await res.json()
    return tasks;
}

async function delTask(taskId) {
    const url = baseUrl + removeQueries + `${taskId}`;

    const options = {
        method: "DELETE",
        headers: header
    };

    const res = await fetch(url, options);

    if (!res.ok) {
        throw new Error(`Failed to delete task. Status: ${res.status}`);
    }
    return; 
}

export{getTasks, postTask, patchTask, delTask}