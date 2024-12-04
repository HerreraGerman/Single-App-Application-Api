const express = require('express');
const router = express.Router();
const Epic = require('../models/epic');
const Story = require('../models/story');
const Task = require('../models/task');
const mongoose = require('mongoose');

///api/stories

const authMiddleware = require('../middlewares/authMiddleware');

// Crear una historia
router.post('/', authMiddleware, async (req, res) => {
    const { title, description, points, status, epic } = req.body;
    const story = new Story({ title, description, points, status, epic });

    try {
        const newStory = await story.save();
        res.status(201).json(newStory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Obtener todas las historias

router.get('/', authMiddleware, async (req, res) => {
    try {
        const userId = req.user.userId; // Note: changed from req.user.id
        console.log("Usuario ID:", userId);
        const stories = await Story.find({
            assignedTo: { $in: [userId] }
        });
        console.log("Historias encontradas:", stories);

        res.json({
            data: stories,
            success: true
        });
    } catch (err) {
        console.error("Error fetching user stories:", err);
        res.status(500).json({
            message: "Error interno del servidor",
            success: false
        });
    }
});

// Historia por id
router.get('/:storyId', authMiddleware, async (req, res) => {
    try {
        const story = await Story.findById(req.params.storyId);
        if (!story) {
            return res.status(404).json({ message: 'Historia no encontrada' });
        }
        res.json(story);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//:storyId/tasks
router.get('/:storyId/tasks', authMiddleware, async (req, res) => {

    const { storyId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(storyId)) {
        return res.status(400).json({ message: "El ID de la historia no es válido" });
    }

    try {
        const tasks = await Task.find({ Story: req.params.storyId }); // ..Filtra por la épica
        console.log("Tareas obtenidas:", tasks);
        res.json(tasks);
    } catch (err) {
        console.error("Error al obtener tareas:", err.message);
        res.status(500).json({ message: "Error interno del servidor" });
    }
});

// Crear una tarea asociada a una historia
router.post('/:storyId/tasks', authMiddleware, async (req, res) => {
    const { storyId } = req.params;
    const { name, description, created, dueDate, done } = req.body;

    // Validar que el ID de la historia sea válido
    if (!mongoose.Types.ObjectId.isValid(storyId)) {
        return res.status(400).json({ message: 'El ID de la historia no es válido' });
    }

    try {
        // Verificar si la historia existe
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Historia no encontrada' });
        }

        // Crear la tarea asociada a la historia
        const task = new Task({
            name,
            description,
            Story: storyId,
            created,
            dueDate,
            done,
        });

        const newTask = await task.save();
        res.status(201).json(newTask);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Eliminar una tarea específica de una historia
router.delete('/:storyId/tasks/:taskId', authMiddleware, async (req, res) => {
    const { storyId, taskId } = req.params;

    // Validar que los IDs sean válidos
    if (!mongoose.Types.ObjectId.isValid(storyId) || !mongoose.Types.ObjectId.isValid(taskId)) {
        return res.status(400).json({ message: 'ID de historia o tarea no válido' });
    }

    try {
        // Verificar que la historia existe
        const story = await Story.findById(storyId);
        if (!story) {
            return res.status(404).json({ message: 'Historia no encontrada' });
        }

        // Buscar y eliminar la tarea asociada a la historia
        const task = await Task.findOneAndDelete({
            _id: taskId,
            Story: storyId
        });

        if (!task) {
            return res.status(404).json({ message: 'Tarea no encontrada o no pertenece a esta historia' });
        }

        res.json({ message: 'Tarea eliminada exitosamente' });
    } catch (err) {
        console.error("Error al eliminar tarea:", err);
        res.status(500).json({ message: 'Error interno del servidor' });
    }
});

module.exports = router;