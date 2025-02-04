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


// calendar list
router.get('/calendar', (req, res) => {
    db.query(`
            SELECT 
                JSON_OBJECTAGG(
                    date, EVENTS
                ) AS json_result
            FROM (
                SELECT
                    d.date,
                    JSON_ARRAYAGG(
                        CONCAT(
                            DATE_FORMAT(e.time, '%H:%i'), 
                            ' - ', 
                            e.description,
                            ' - ',
                            e.event_id
                        )
                    ) AS EVENTS
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

// 날짜 추가 API 엔드포인트
router.post('/addDate', (req, res) => {
    const { date } = req.body;

    if (!date) {
        return res.status(400).json({ error: 'Missing required field: date' });
    }

    const query = `
        INSERT INTO dates (date)
        VALUES (?)
    `;

    db.query(query, [date], (err, results) => {
        if (err) {
            console.error('Error inserting date:', err);
            return res.status(500).json({ error: 'Failed to add date' });
        }
        res.status(201).json({ message: 'Date added successfully', dateId: results.insertId });
    });
});

// 이벤트 추가 API 엔드포인트
router.post('/addEvent', (req, res) => {
    const { date_id, time, description, event_id } = req.body;
    console.log(`Received request to add event: date_id=${date_id}, time=${time}, description=${description}`); // 디버깅 로그



    if (!date_id || !time || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO events (date_id, time, description,event_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [date_id, time, description, event_id], (err, results) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Failed to add event' });
        }
        res.status(201).json({ message: '일정을 추가 하였습니다.', eventId: event_id });
    });
});

// 이벤트 삭제 API 엔드포인트
router.delete('/deleteEvent/:eventId', (req, res) => {
    const { eventId } = req.params;

    if (!eventId) {
        return res.status(400).json({ error: 'Missing required parameter: eventId' });
    }

    const query = `
        DELETE FROM events
        WHERE event_id = ?
    `;

    db.query(query, [eventId], (err, results) => {
        if (err) {
            console.error('Error deleting event:', err);
            return res.status(500).json({ error: 'Failed to delete event' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Event not found' });
        }
        res.status(200).json({ message: 'Event deleted successfully' });
    });
});

// 📌 Fetch reservations data
router.get('/reservations', (req, res) => {
    db.query(`
        SELECT * FROM reservations
    `, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            // 결과를 JSON 형식으로 변환하여 응답
            res.json(results);
        }
    });
});




module.exports = router;
