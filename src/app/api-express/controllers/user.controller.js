const register = (db) => (req, res) => {
    // limpiar los datos de entrada
    const user = req.body.user ? req.body.user.trim() : '';
    const email = req.body.email ? req.body.email.trim() : '';
    const contrasena = req.body.contrasena ? req.body.contrasena.trim() : '';

    if (!user || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    
    const checkUserSql = 'SELECT user, email FROM usuarios WHERE LOWER(user) = ? OR LOWER(email) = ?';
    db.query(checkUserSql, [user.toLowerCase(), email.toLowerCase()], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            const userExists = results.some(row => row.user.toLowerCase() === user.toLowerCase());
            const emailExists = results.some(row => row.email.toLowerCase() === email.toLowerCase());

            if (userExists) {
                return res.status(409).json({ error: 'El nombre de usuario ya está en uso.' });
            }
            if (emailExists) {
                return res.status(409).json({ error: 'El correo electrónico ya está en uso.' });
            }
        }

        // Insertar los datos 
        const insertUserSql = 'INSERT INTO usuarios (user, email, contrasena) VALUES (?, ?, ?)';
        db.query(insertUserSql, [user, email, contrasena], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error interno del servidor' });
            }
            res.status(201).json({ mensaje: 'Usuario registrado correctamente', id: result.insertId });
        });
    });
};

const login = (db) => (req, res) => {
    const user = req.body.user ? req.body.user.trim() : '';
    const contrasena = req.body.contrasena ? req.body.contrasena.trim() : '';

    if (!user || !contrasena) {
        return res.status(400).json({ error: 'Usuario y contraseña son requeridos' });
    }

    const sql = 'SELECT * FROM usuarios WHERE user = ? AND contrasena = ?';
    db.query(sql, [user, contrasena], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error interno del servidor' });
        }

        if (results.length > 0) {
            res.json({
                mensaje: 'Inicio de sesión exitoso',
                usuario: {
                    id: results[0].id,
                    user: results[0].user,
                    email: results[0].email,
                },
            });
        } else {
            res.status(401).json({ mensaje: 'Credenciales inválidas' });
        }
    });
};

module.exports = {
    register,
    login,
};