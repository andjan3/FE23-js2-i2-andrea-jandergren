import express from "express";
import {body, validationResult} from "express-validator";
import cors from 'cors';
import * as db from "./src/handleDatabase.js"

const app = express();
app.use(express.json());
app.use(cors());

const postValidations = [
    body('task').exists().isString(),
    body('category').exists().isString()
];

const patchValidations = [
    body('status').exists().isString(),
    body('assigned').exists().isString()
];

app.listen(3000, () => {
  console.log("Listening on port 3000 ...");
});


const message404 = {message: 'Tasks not found'};

app.get('/api/tasks', async (req, res) => {
    try {
        const tasks = await db.getTasks(req.params);
        if (tasks) {
            res.json(tasks);
        } 
        else {
            res.status(404).json(message404);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


app.post('/api/tasks', postValidations, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) {
            res.status(400).json({ message: 'wrong format' });
        } 
        else {
            const newTask = await db.postTask(req.body);
            res.send(newTask);
        }
        console.log(req.body);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

app.patch('/api/tasks', patchValidations, async (req, res) => {
    try {
        const errors = validationResult(req);
        if (errors.array().length > 0) {
            res.status(400).json({ message: 'wrong format' });
            return;
        }

        const updateDatabase = await db.patchTask(req.query.id, req.body.status, req.body.assigned);
        res.json(updateDatabase);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }

});

app.delete('/api/removetask', async (req, res) => {
    try {
        const task = await db.delTask(req.query.id);

        if (task) {
            res.json({ task, message: 'removed' });
        } 
        else {
            res.status(404).json(message404);
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});
