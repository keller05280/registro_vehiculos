const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const app = express(); 
const port = 3000;


app.use(cors({
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
}));


app.use(express.json());

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

app.post('/usuarios/registro', (req, res) => {
    console.log("Datos recibidos del frontend (registro):", req.body);
    const { user, email, contrasena } = req.body;
    if (!user || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }
    db.query('INSERT INTO usuarios (user, email, contrasena) VALUES (?, ?, ?)', [user, email, contrasena], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(500).json({ error: 'Error interno del servidor', sqlError: err });
        } else {
            res.json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });
        }
    });
});

app.post('/usuarios/login', (req, res) => {
  console.log("Datos recibidos del frontend (login):", req.body);
  const { user, contrasena } = req.body;
  console.log("Usuario:", user, "Contraseña:", contrasena);
  console.log("Longitud de los datos:", user.length, contrasena.length);
  const sql = 'SELECT * FROM usuarios WHERE user = ? AND contrasena = ?';
  console.log("Consulta SQL:", sql, [user, contrasena]);
  db.query(sql, [user, contrasena], (err, results) => {
      if (err) {
          console.error("Error en la consulta (login):", err);
          console.log("Error SQL:", err); 
          return res.status(500).json({ error: 'Error interno del servidor', sqlError: err });
      } else {
          console.log("Resultados de la consulta (login):", results);
          if (results.length > 0) {
           
              if (results[0]) {
                  res.json({
                      mensaje: 'Inicio de sesión exitoso',
                      usuario: {
                          id: results[0].id,
                          user: results[0].user,
                          email: results[0].email,
                      },
                  });
              } else {
                  console.error("Error: results[0] es undefined");
                  res.status(500).json({ error: 'Error interno del servidor' });
              }
          } else {
              console.log("No se encontró ningún usuario con las credenciales proporcionadas.");
              res.status(401).json({ mensaje: 'Credenciales inválidas' });
          }
      }
  });
});


app.get('/vehiculos/:id_usuarios', (req, res) => {
  const id_usuarios = req.params.id_usuarios;
  db.query('SELECT * FROM vehiculo WHERE id_usuarios = ?', [id_usuarios], (err, results) => {
      if (err) {
          console.error('Error al obtener vehículos:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
      } else {
          res.json(results);
      }
  });
});

app.post('/vehiculos', (req, res) => {
  const { id_usuarios, marca, modelo, placa, descripcion } = req.body;
  db.query('INSERT INTO vehiculo (id_usuarios, marca, modelo, placa, descripcion) VALUES (?, ?, ?, ?, ?)', [id_usuarios, marca, modelo, placa, descripcion], (err, result) => {
      if (err) {
          console.error('Error al agregar vehículo:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
      } else {
          res.json({ mensaje: 'Vehículo agregado correctamente', id: result.insertId });
      }
  });
});

app.put('/vehiculos/:id', (req, res) => {
    const id = req.params.id;
    const { id_usuarios, marca, modelo, placa, descripcion } = req.body;
    console.log('Datos recibidos para la actualización:', { id, id_usuarios, marca, modelo, placa, descripcion });
    db.query('UPDATE vehiculo SET id_usuarios = ?, marca = ?, modelo = ?, placa = ?, descripcion = ? WHERE id = ?', [id_usuarios, marca, modelo, placa, descripcion, id], (err, result) => {
        if (err) {
            console.error('Error al actualizar vehículo:', err);
            res.status(500).json({ error: 'Error interno del servidor' });
        } else {
            console.log('Vehículo actualizado correctamente:', result);
            if (result.affectedRows > 0) {
                res.json({ mensaje: 'Vehículo actualizado correctamente' });
            } else {
                res.status(404).json({ mensaje: 'Vehículo no encontrado' });
            }
        }
    });
});

app.delete('/vehiculos/:id', (req, res) => {
  const id = req.params.id;
  db.query('DELETE FROM vehiculo WHERE id = ?', [id], (err, result) => {
      if (err) {
          console.error('Error al eliminar vehículo:', err);
          res.status(500).json({ error: 'Error interno del servidor' });
      } else {
          res.json({ mensaje: 'Vehículo eliminado correctamente' });
      }
  });
});

app.listen(port, () => {
  console.log(`Servidor Express.js escuchando en el puerto ${port}`);
});