const User = require('../models/user');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    // Verificar contraseña (idealmente usando bcrypt)
    const isMatch = password === user.password; // Esto es inseguro, usa bcrypt en producción
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    // Generar token (usando jwt)
    const token = jwt.sign(
      { userId: user._id, username: user.username }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor', error: error.message });
  }
};

module.exports = { loginUser };