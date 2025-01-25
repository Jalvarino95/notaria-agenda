const sqlite3 = require("sqlite3").verbose();

// Crear/Conectar a la base de datos
const db = new sqlite3.Database("notaria.db", (err) => {
    if (err) {
        console.error("Error al conectar a la base de datos", err.message);
    } else {
        console.log("Conectado a la base de datos SQLite.");
    }
});

// Crear tabla de citas si no existe
db.serialize(() => {
    db.run(`
        CREATE TABLE IF NOT EXISTS citas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nombre TEXT NOT NULL,
            telefono TEXT NOT NULL,
            correo TEXT NOT NULL,
            servicio TEXT NOT NULL,
            fecha TEXT NOT NULL,
            hora TEXT NOT NULL
        )
    `);
});

module.exports = db;
