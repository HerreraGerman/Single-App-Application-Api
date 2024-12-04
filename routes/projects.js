const express = require('express');
const router = express.Router();
const Project = require('../models/project');
const Epic = require('../models/epic');
const authMiddleware = require('../middlewares/authMiddleware');

// Crear un proyecto
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { name, description, icon, members } = req.body;
        
        // El usuario autentificado se convierte en el dueño
        const ownerId = req.user.userId;

        // Ensure the owner is included in members if not already
        const projectMembers = members 
            ? Array.from(new Set([...members, ownerId])) // Remove duplicates
            : [ownerId];

        const newProject = new Project({
            name,
            description,
            icon,
            owner: ownerId,
            members: projectMembers
        });

        const savedProject = await newProject.save();

        res.status(201).json(savedProject);
    } catch (err) {
        console.error("Error creating project:", err);
        res.status(500).json({ 
            message: "Error al crear el proyecto", 
            error: err.message 
        });
    }
});

// Obtener todos los proyectos
router.get('/', authMiddleware, async (req, res) => {
    try {
        const projects = await Project.find(); 
        res.json(projects);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un proyecto por su ID
router.get('/:id', authMiddleware, async (req, res) => {
    try {
        const project = await Project.findById(req.params.id);
        if (!project) {
            return res.status(404).json({ message: "Project not found" });
        }
        res.json(project);
    } catch (err) {
        console.error("Error fetching project by ID:", err);
        res.status(500).json({ message: err.message });
    }
});3

// Obtener todas las épicas de un proyecto
router.get('/:id/epics', authMiddleware, async (req, res) => {
    
    try {
        console.log('Fetching epics for project:', req.params.id);
        const project = await Project.findById(req.params.id);
        console.log('Found project:', project);
        const epics = await Epic.find({ project: project._id });
        console.log('Found epics:', epics);
        res.json(epics);
    } catch (err) {
        console.error('Error fetching epics:', err);
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;