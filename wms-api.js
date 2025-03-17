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

/**
 * @swagger
 * /inbound:
 *   get:
 *     summary: Fetch inbound data
 *     responses:
 *       200:
 *         description: Inbound data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/inbound', (req, res) => {
    db.query('SELECT * FROM inbound_data ORDER BY date DESC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

/**
 * @swagger
 * /inbound/add:
 *   post:
 *     summary: Add new inbound record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               isbn:
 *                 type: string
 *     responses:
 *       200:
 *         description: New inbound record added
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /inbound/update:
 *   post:
 *     summary: Update inbound data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 changes:
 *                   type: object
 *     responses:
 *       200:
 *         description: Inbound data updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /inbound/delete:
 *   delete:
 *     summary: Delete inbound records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *     responses:
 *       200:
 *         description: Inbound records deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /outbound:
 *   get:
 *     summary: Fetch outbound data
 *     responses:
 *       200:
 *         description: Outbound data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/outbound', (req, res) => {
    db.query('SELECT * FROM outbound_data ORDER BY date DESC', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

/**
 * @swagger
 * /outbound/add:
 *   post:
 *     summary: Add new outbound record
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date-time
 *               title:
 *                 type: string
 *               quantity:
 *                 type: integer
 *               isbn:
 *                 type: string
 *     responses:
 *       200:
 *         description: New outbound record added
 *         content:
 *           application/json:
 *             schema: 
 *               type: object
 */
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

/**
 * @swagger
 * /outbound/update:
 *   post:
 *     summary: Update outbound data
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                 changes:
 *                   type: object
 *     responses:
 *       200:
 *         description: Outbound data updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /outbound/delete:
 *   delete:
 *     summary: Delete outbound records
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *     responses:
 *       200:
 *         description: Outbound records deleted
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /calendar:
 *   get:
 *     summary: Fetch calendar list
 *     responses:
 *       200:
 *         description: Calendar list fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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
            const jsonResult = results[0].json_result;
            res.json(JSON.parse(jsonResult));
        }
    });
});



/**
 * @swagger
 * /addDate:
 *   post:
 *     summary: Add new date
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Date added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /addEvent:
 *   post:
 *     summary: Add new event
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date_id:
 *                 type: integer
 *               time:
 *                 type: string
 *                 format: time
 *               description:
 *                 type: string
 *               event_id:
 *                 type: string
 *     responses:
 *       201:
 *         description: Event added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
router.post('/addEvent', (req, res) => {
    const { date_id, time, description, event_id } = req.body;
    console.log(`Received request to add event: date_id=${date_id}, time=${time}, description=${description}`); // Debug log

    if (!date_id || !time || !description) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const query = `
        INSERT INTO events (date_id, time, description, event_id)
        VALUES (?, ?, ?, ?)
    `;

    db.query(query, [date_id, time, description, event_id], (err, results) => {
        if (err) {
            console.error('Error inserting event:', err);
            return res.status(500).json({ error: 'Failed to add event' });
        }
        res.status(201).json({ message: 'Event added successfully', eventId: event_id });
    });
});

/**
 * @swagger
 * /deleteEvent/{eventId}:
 *   delete:
 *     summary: Delete event
 *     parameters:
 *       - in: path
 *         name: eventId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Event deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 */
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

/**
 * @swagger
 * /reservations:
 *   get:
 *     summary: Fetch reservations data
 *     responses:
 *       200:
 *         description: Reservations data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/reservations', (req, res) => {
    db.query(`
        SELECT * FROM reservations
    `, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

/**
 * @swagger
 * /members:
 *   get:
 *     summary: Fetch members data
 *     responses:
 *       200:
 *         description: Members data fetched successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 */
router.get('/members', (req, res) => {
    db.query(`
        SELECT * FROM employees
    `, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});


router.get('/bookings', (req, res) => {
    db.query(`
        SELECT JSON_OBJECTAGG(
            room_number,
            (SELECT JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'guestName', guest_name,
                            'checkInDate', check_in_date,
                            'checkOutDate', check_out_date,
                            'arrivalTime', arrival_time,
                            'departureTime', departure_time,
                            'cost', cost
                        )
                    )
             FROM booking AS r2
             WHERE r1.room_number = r2.room_number
            )
        ) AS result
        FROM booking AS r1
    `, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const jsonResult = results[0].result;
            res.json(JSON.parse(jsonResult));
        }
    });
});


router.get('/glos', (req, res) => {
    db.query('SELECT * FROM glos order by id desc', (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            res.json(results);
        }
    });
});

// pseudo-code
router.post("/glos_req", (req, res) => {
    const { glos_id, req_msg } = req.body;
    if (!glos_id || !req_msg) {
        return res.status(400).json({ success: false, message: "Missing fields" });
    }

    // INSERT
    const sql = `INSERT INTO glos_req (glos_id, req_msg, req_date) VALUES (?, ?, CURDATE())`;
    db.query(sql, [glos_id, req_msg], (err, result) => {
        if (err) {
            console.error("DB insert error:", err);
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        return res.json({ success: true, message: "정정 요청이 DB에 저장되었습니다.", insertId: result.insertId });
    });
});


router.put("/glos/:id", (req, res) => {
    const { id } = req.params; // URL 파라미터 (:id)
    const { en, ko, desc, img } = req.body; // 수정할 필드들

    // 간단 검증
    if (!id) {
        return res.status(400).json({ success: false, message: "Missing id param" });
    }
    if (!en && !ko && !desc && !img) {
        return res
            .status(400)
            .json({ success: false, message: "No fields to update" });
    }

    // UPDATE SQL (필요한 필드만 업데이트하는 로직도 가능)
    const sql = `UPDATE glos 
                 SET en=?, ko=?, \`desc\`=?, img=? 
                 WHERE id=?`;

    const values = [en, ko, desc, img, id];

    db.query(sql, values, (err, result) => {
        if (err) {
            console.error("DB update error:", err);
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        if (result.affectedRows === 0) {
            return res
                .status(404)
                .json({ success: false, message: "No row updated (id not found)" });
        }
        return res.json({ success: true, message: "Row updated successfully" });
    });
});


router.post("/setGlos", (req, res) => {
    const { en, ko, desc, img } = req.body;

    // 간단 검증
    if (!en || !ko) {
        return res.status(400).json({ success: false, message: "en, ko 필수" });
    }

    const sql = `INSERT INTO glos (en, ko, \`desc\`, img)
                 VALUES (?, ?, ?, ?)`;

    db.query(sql, [en, ko, desc, img], (err, result) => {
        if (err) {
            console.error("INSERT error:", err);
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        // 새로 생성된 ID (AUTO_INCREMENT)
        const newId = result.insertId;
        return res.json({ success: true, message: "New row inserted", id: newId });
    });
});

router.post("/glos/delete", (req, res) => {
    const { ids } = req.body; // { ids: [1,4,7] }
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No IDs provided" });
    }

    // DELETE FROM glos WHERE id IN (1,4,7)
    const placeholder = ids.map(() => '?').join(',');
    const sql = `DELETE FROM glos WHERE id IN (${placeholder})`;

    db.query(sql, ids, (err, result) => {
        if (err) {
            console.error("DELETE error:", err);
            return res.status(500).json({ success: false, message: "DB Error" });
        }
        return res.json({ success: true, message: result.affectedRows + " rows deleted" });
    });
});


router.get("/getGlosReq", (req, res) => {
    const { glos_id } = req.query;
    if (!glos_id) {
        return res.status(400).json({ success: false, message: "Missing glos_id" });
    }

    // 예: glos_req 테이블 (id, glos_id, req_msg, req_date)
    const sql = "SELECT * FROM glos_req WHERE glos_id = ?";
    db.query(sql, [glos_id], (err, rows) => {
        if (err) {
            console.error("glos_req query error:", err);
            return res.status(500).json({ success: false, message: "DB error" });
        }
        return res.json(rows);
    });
});


router.get("/lockers", (req, res) => {
   
    const sql = `SELECT 
    JSON_ARRAYAGG(
        JSON_OBJECT(
            'id', l.id,
            'status', l.status,
            'assignedUser', u.name,
            'usageHistory', (
                SELECT JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'date', h.usage_date,
                        'username', u2.name,
                        'remarks', h.remarks
                    )
                )
                FROM locker_usage_history h
                JOIN users u2 ON h.user_id = u2.id
                WHERE h.locker_id = l.id
            )
        )
    ) AS locker_data
FROM lockers l
LEFT JOIN users u ON l.assigned_user_id = u.id;
`;
    db.query(sql, (err, results) => {
        if (err) {
            res.status(500).json({ error: err.message });
        } else {
            const jsonResult = results[0].locker_data;
            res.json(JSON.parse(jsonResult));
            
        }
    });
});


module.exports = router;