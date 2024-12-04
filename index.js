// 1. Importar dependencias
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();
console.log(process.env.JWT_SECRET);  // ...Debería mostrar clavesecreta en el archivo .env


// 2. Inicializar aplicación
const app = express();
const PORT = 3000;

// 3. Middlewares
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'auth']
}));

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// 4. Conexión a la base de datos
mongoose.connect(process.env.MONGO_URI || "mongodb+srv://OmarVillegas:pobrediabla@normandy.p7oeo.mongodb.net/");
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

// 5. Rutas
const usersRouter = require('./routes/users');
const authRoutes = require('./routes/routes');

const projectsRouter = require('./routes/projects');
const epicsRouter = require('./routes/epics');
const storiesRouter = require('./routes/stories');
const tasksRouter = require('./routes/tasks');

// Montar rutas de autenticación
app.use('/api', authRoutes); // Esto incluye /api/login
app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/epics', epicsRouter);
app.use('/api/stories', storiesRouter);
app.use('/api/tasks', tasksRouter);

// 6. Iniciar servidor
app.listen(PORT, () => {
  console.log(`Server is Ready! http://localhost:${PORT}`);
});