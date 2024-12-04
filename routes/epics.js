const express = require('express');
const router = express.Router();
const Epic = require('../models/epic');
const Story = require('../models/story');
const authMiddleware = require('../middlewares/authMiddleware');
const mongoose = require('mongoose');

// Crear una épica
router.post('/', authMiddleware, async (req, res) => {
  const { project, name, description, icon } = req.body;
  const epic = new Epic({ project, name, description, icon });

  try {
    const newEpic = await epic.save();
    res.status(201).json(newEpic);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Obtener todas las épicas
router.get('/', authMiddleware, async (req, res) => {
  try {
    const epics = await Epic.find();
    res.json(epics);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Obtener una épica por ID
router.get('/:epicId', authMiddleware, async (req, res) => {
  try {
    const epic = await Epic.findById(req.params.epicId);
    if (!epic) {
      return res.status(404).json({ message: 'Épica no encontrada' });
    }
    res.json(epic);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Obtener historias de una épica específica
router.get('/:epicId/stories', authMiddleware, async (req, res) => {

  const { epicId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(epicId)) {
    return res.status(400).json({ message: "El ID de la épica no es válido" });
  }

  try {
    const stories = await Story.find({ Epic: req.params.epicId }); //Filtra por la épica
    console.log("Historias obtenidas:", stories);
    res.json(stories);
  } catch (err) {
    console.error("Error al obtener historias:", err.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

module.exports = router;