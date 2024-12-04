const express = require('express');
const router = express.Router();
const Story = require('../models/story');
const Task = require('../models/task');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear una tarea
router.post('/', authMiddleware, async (req, res) => {
    const { name, description, Story, created, dueDate, done } = req.body;
    if (!Story) {
        return res.status(400).json({ message: 'Story ID is required' });
    }
    const task = new Task({ name, description, Story, created, dueDate, done });

    try {
        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todas las tareas
router.get('/', authMiddleware, async (req, res) => {
    try {
        const stories = await Task.find();
        res.json(stories);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:taskId', authMiddleware, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({ message: 'Tarea no encontrada' });
        }
        res.json(story);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;