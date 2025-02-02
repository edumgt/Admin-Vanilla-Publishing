const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'bbs'
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
    } else {
        console.log('Connected to MySQL database');
    }
});

// Fetch inbound data
app.get('/api/inbound', (req, res) => {

    db.query('SELECT * FROM inbound_data', (err, results) => {
        if (err) {
            console.log(res);
            res.status(500).json({ error: err.message });
        } else {
            console.log(res);
            res.json(results);
        }
    });
});

// Add new inbound record
app.post('/api/inbound/add', (req, res) => {

    const newItem = { id: uuidv4(), ...req.body };
    console.log(newItem);
    const query = 'INSERT INTO inbound_data (id, date, title, quantity, isbn) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [newItem.id, newItem.date, newItem.title, newItem.quantity, newItem.isbn], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'New inbound record added', item: newItem });
        }
    });
});

// Add new inbound record with client-provided UUID
// app.post('/api/inbound/add', (req, res) => {
//     const { id, date, title, quantity, isbn } = req.body;
//     if (!id || !date || !title || !quantity || !isbn) {
//         return res.status(400).json({ error: "Missing required fields" });
//     }

//     const query = 'INSERT INTO inbound_data (id, date, title, quantity, isbn) VALUES (?, ?, ?, ?, ?)';

//     db.query(query, [id, date, title, quantity, isbn], (err, result) => {
//         if (err) {
//             res.status(500).json({ error: err.message });
//         } else {
//             res.json({ success: true, message: 'New inbound record added', item: { id, date, title, quantity, isbn } });
//         }
//     });
// });

// Update inbound data (Only update changed fields)
app.post('/api/inbound/update', (req, res) => {
    console.log('Received update request:', req.body);

    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of updates." });
    }

    const updatePromises = updates.map(update => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(update.changes);
            if (fields.length === 0) {
                return resolve(); // No changes to update
            }

            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => update.changes[field]);
            values.push(update.id); // Add ID to the values array for WHERE clause

            const query = `UPDATE inbound_data SET ${setClause} WHERE id = ?`;
            console.log('Executing query:', query, 'Values:', values);

            db.query(query, values, (err, result) => {
                if (err) {
                    console.error("MySQL Update Error:", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => res.json({ success: true, message: 'Inbound data updated' }))
        .catch(err => res.status(500).json({ error: err.message }));
});


// Delete inbound records
app.delete('/api/inbound/delete', (req, res) => {
    console.log('Delete request:', req.body);
    const idsToDelete = req.body.map(item => item.id);
    const query = 'DELETE FROM inbound_data WHERE id IN (?)';
    db.query(query, [idsToDelete], (err, result) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'Inbound records deleted' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
