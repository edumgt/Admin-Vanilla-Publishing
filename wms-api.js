const mysql = require('mysql2');
const { v4: uuidv4 } = require('uuid');
const express = require('express');

const router = express.Router();

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

// 📌 Fetch inbound data
router.get('/inbound', (req, res) => {
    db.query('SELECT * FROM inbound_data ORDER BY date DESC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// 📌 Add new inbound record
router.post('/inbound/add', (req, res) => {
    const newItem = { id: uuidv4(), ...req.body };
    const query = 'INSERT INTO inbound_data (id, date, title, quantity, isbn) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [newItem.id, newItem.date, newItem.title, newItem.quantity, newItem.isbn], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'New inbound record added', item: newItem });
        }
    });
});

// 📌 Update inbound data
router.post('/inbound/update', (req, res) => {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of updates." });
    }

    const updatePromises = updates.map(update => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(update.changes);
            if (fields.length === 0) return resolve();

            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => update.changes[field]);
            values.push(update.id);

            const query = `UPDATE inbound_data SET ${setClause} WHERE id = ?`;

            db.query(query, values, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => res.json({ success: true, message: 'Inbound data updated' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// 📌 Delete inbound records
router.delete('/inbound/delete', (req, res) => {
    const idsToDelete = req.body.map(item => item.id);
    const query = 'DELETE FROM inbound_data WHERE id IN (?)';

    db.query(query, [idsToDelete], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'Inbound records deleted' });
        }
    });
});

// 📌 Fetch outbound data
router.get('/outbound', (req, res) => {
    db.query('SELECT * FROM outbound_data ORDER BY date DESC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// 📌 Add new outbound record
router.post('/outbound/add', (req, res) => {
    const newItem = { id: uuidv4(), ...req.body };
    const query = 'INSERT INTO outbound_data (id, date, title, quantity, isbn) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [newItem.id, newItem.date, newItem.title, newItem.quantity, newItem.isbn], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'New outbound record added', item: newItem });
        }
    });
});

// 📌 Update outbound data
router.post('/outbound/update', (req, res) => {
    const updates = req.body;
    if (!Array.isArray(updates) || updates.length === 0) {
        return res.status(400).json({ error: "Invalid request format. Expected an array of updates." });
    }

    const updatePromises = updates.map(update => {
        return new Promise((resolve, reject) => {
            const fields = Object.keys(update.changes);
            if (fields.length === 0) return resolve();

            const setClause = fields.map(field => `${field} = ?`).join(', ');
            const values = fields.map(field => update.changes[field]);
            values.push(update.id);

            const query = `UPDATE outbound_data SET ${setClause} WHERE id = ?`;

            db.query(query, values, (err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    });

    Promise.all(updatePromises)
        .then(() => res.json({ success: true, message: 'Outbound data updated' }))
        .catch(err => res.status(500).json({ error: err.message }));
});

// 📌 Delete outbound records
router.delete('/outbound/delete', (req, res) => {
    const idsToDelete = req.body.map(item => item.id);
    const query = 'DELETE FROM outbound_data WHERE id IN (?)';

    db.query(query, [idsToDelete], (err) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json({ success: true, message: 'Outbound records deleted' });
        }
    });
});

router.get('/calendar', (req, res) => {
    db.query(`
            SELECT 
                JSON_OBJECTAGG(
                    date, events
                ) AS json_result
            FROM (
                SELECT
                    d.date,
                    JSON_ARRAYAGG(
                        CONCAT(
                            DATE_FORMAT(e.time, '%H:%i'), 
                            ' - ', 
                            e.description
                        )
                    ) AS events
                FROM 
                    dates d
                JOIN 
                    events e ON d.date_id = e.date_id
                
                GROUP BY 
                    d.date
            ) AS subquery
            `, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // json_result 필드 값만 추출하여 반환
            const jsonResult = results[0].json_result;
            res.json(JSON.parse(jsonResult));
        }
    });
});


module.exports = router;
