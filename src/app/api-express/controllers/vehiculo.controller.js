const create = (db) => (req, res) => {
    const { id_usuarios } = req.body;
    const marca = req.body.marca ? req.body.marca.trim() : '';
    const modelo = req.body.modelo ? req.body.modelo.trim() : '';
    const placa = req.body.placa ? req.body.placa.trim() : '';
    const descripcion = req.body.descripcion ? req.body.descripcion.trim() : '';

    const errors = [];
    if (!id_usuarios) { errors.push("El campo 'id_usuarios' es obligatorio."); }
    if (!marca) { errors.push("El campo 'marca' es obligatorio."); }
    if (!modelo) { errors.push("El campo 'modelo' es obligatorio."); }
    if (!placa) { errors.push("El campo 'placa' es obligatorio."); }

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    const sql = 'INSERT INTO vehiculo (id_usuarios, marca, modelo, placa, descripcion) VALUES (?, ?, ?, ?, ?)';
    db.query(sql, [id_usuarios, marca, modelo, placa, descripcion || null], (err, result) => {
        if (err) { return res.status(500).json({ error: 'Error interno del servidor' }); }
        res.status(201).json({ mensaje: 'Vehículo agregado correctamente', id: result.insertId });
    });
};

const update = (db) => (req, res) => {
    const { id } = req.params;
    const { id_usuarios } = req.body;
    const marca = req.body.marca ? req.body.marca.trim() : '';
    const modelo = req.body.modelo ? req.body.modelo.trim() : '';
    const placa = req.body.placa ? req.body.placa.trim() : '';
    const descripcion = req.body.descripcion ? req.body.descripcion.trim() : '';

    const errors = [];
    if (!id_usuarios) { errors.push("El campo 'id_usuarios' es obligatorio."); }
    if (!marca) { errors.push("El campo 'marca' es obligatorio."); }
    if (!modelo) { errors.push("El campo 'modelo' es obligatorio."); }
    if (!placa) { errors.push("El campo 'placa' es obligatorio."); }

    if (errors.length > 0) {
        return res.status(400).json({ errors: errors });
    }

    const sql = 'UPDATE vehiculo SET id_usuarios = ?, marca = ?, modelo = ?, placa = ?, descripcion = ? WHERE id = ?';
    db.query(sql, [id_usuarios, marca, modelo, placa, descripcion || null, id], (err, result) => {
        if (err) { return res.status(500).json({ error: 'Error interno del servidor' }); }
        if (result.affectedRows > 0) {
            res.json({ mensaje: 'Vehículo actualizado correctamente' });
        } else {
            res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
    });
};

const getAllByUser = (db) => (req, res) => {
    const { id_usuarios } = req.params;
    db.query('SELECT * FROM vehiculo WHERE id_usuarios = ?', [id_usuarios], (err, results) => {
        if (err) { return res.status(500).json({ error: 'Error interno del servidor' }); }
        res.json(results);
    });
};

const getById = (db) => (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM vehiculo WHERE id = ?', [id], (err, results) => {
        if (err) { return res.status(500).json({ error: 'Error interno del servidor' }); }
        if (results.length > 0) {
            res.json(results[0]); // Devuelve solo el primer objeto, no el array
        } else {
            res.status(404).json({ mensaje: 'Vehículo no encontrado' });
        }
    });
};

const remove = (db) => (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM vehiculo WHERE id = ?', [id], (err, result) => {
        if (err) { return res.status(500).json({ error: 'Error interno del servidor' }); }
        res.json({ mensaje: 'Vehículo eliminado correctamente' });
    });
};

module.exports = {
    create,
    update,
    getAllByUser,
    getById, // Exportar la nueva función
    remove,
};