import fs from 'fs/promises';

async function readDatabase(){
    const rawDb = await fs.readFile('./src/taskdb.json');
    return JSON.parse(rawDb);
}

async function writeDatabase(tasks) {
    await fs.writeFile('./src/taskdb.json', JSON.stringify(tasks, null, 4));
}

async function getTasks() {
    try {
        return await readDatabase();
    } catch (error) {
        console.error(error);
        return [];
    }
}

async function postTask(task) {
    try {
        const newTask = { id: Date.now(), ...task, status: "to do", assigned: "none" };
        const tasks = await getTasks(); 
        tasks.push(newTask);
        await writeDatabase(tasks)
        
        return newTask;
    } catch (error) {
        console.error(error);
        throw new Error('Error in postTask'); 
    }
}

async function patchTask(taskId, status, assigned) {
    try {
        const tasks = await getTasks();
        const matchingTask = tasks.find(task => task.id == taskId);

        if (matchingTask) {
            matchingTask.status = status;
            matchingTask.assigned = assigned;

            await writeDatabase(tasks);

            return { message: 'Changed task successfully', matchId: matchingTask.id };
        } 
        else {
            return { message: 'Task not found' };
        }
    } catch (error) {
        console.error(error);
        return { message: 'Internal Server Error' };
    }
}

async function delTask(taskId) {
    const tasks = await getTasks();
    
    let index;
    const task = tasks.find((currentTask, currentIndex) => {
        index = currentIndex;
        return currentTask.id.toString() === taskId.toString();
    });

    if (task) {
        tasks.splice(index, 1);
        await writeDatabase(tasks)
        console.log('Task removed. Updated tasks:', tasks);
    }
    return tasks;
}

export{getTasks, postTask, patchTask, delTask}