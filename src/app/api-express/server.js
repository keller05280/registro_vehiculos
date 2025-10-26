const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// Controladores
const userController = require('./controllers/user.controller');
const vehiculoController = require('./controllers/vehiculo.controller');

const app = express();
const port = 3000;

// Middlewares
app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));
app.use(express.json());

// Conexión a la Base de Datos
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'taller'
});

db.connect((err) => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
    } else {
        console.log('Conectado a la base de datos MySQL');
    }
});

// --- RUTAS ---

// Rutas de Usuarios
app.post('/usuarios/registro', userController.register(db));
app.post('/usuarios/login', userController.login(db));

// Rutas de Vehículos
app.get('/vehiculo/:id', vehiculoController.getById(db));
app.get('/vehiculos/:id_usuarios', vehiculoController.getAllByUser(db));
app.post('/vehiculos', vehiculoController.create(db));
app.put('/vehiculos/:id', vehiculoController.update(db));
app.delete('/vehiculos/:id', vehiculoController.remove(db));

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});