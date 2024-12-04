const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

//Crear usuarios (solo para poblar la DB)
router.post('/', async (req, res) => {
    try {
        const { email, username, password } = req.body;

        // Comprobar si existe el usuario
        const existingUser = await User.findOne({ $or: [{ email }, { username }] });
        if (existingUser) {
            return res.status(400).json({ message: 'Usuario o email ya existe' });
        }

        // Crear nuevo usuario
        const newUser = new User({
            email,
            username,
            password // Almacenar contraseña
        });

        // Guardar user en la DB
        const savedUser = await newUser.save();

        // Remover contraseña por seguridad
        const userResponse = {
            _id: savedUser._id,
            email: savedUser.email,
            username: savedUser.username
        };

        res.status(201).json(userResponse);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error al crear usuario', error: err.message });
    }
});


module.exports = router;