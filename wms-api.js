const mysql = require('mysql2');
const express = require('express');

const router = express.Router();

const db = mysql.createConnection({
    host: 'edumgtmariadb.cg0ugoglztrn.ap-northeast-2.rds.amazonaws.com',
    user: 'edumgt',
    password: 'edumgt2250!',
    database: 'bbs',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
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
 * /api/calendar:
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
 * /api/addDate:
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
 * /api/addEvent:
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
 * /api/deleteEvent/{eventId}:
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
 * /api/reservations:
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
 * /api/members:
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
        const newId = result.insertId;
        return res.json({ success: true, message: "New row inserted", id: newId });
    });
});

router.post("/glos/delete", (req, res) => {
    const { ids } = req.body; // { ids: [1,4,7] }
    if (!Array.isArray(ids) || ids.length === 0) {
        return res.status(400).json({ success: false, message: "No IDs provided" });
    }
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


router.get('/menu', function (req, res) {
    const sql = `
        SELECT
          mp.page_name,
          mi.href,
          mi.label,
          im.icon_class
        FROM menu_page mp
        JOIN menu_item mi ON mp.id = mi.menu_page_id
        LEFT JOIN icon_mapping im ON mi.label = im.label
        ORDER BY mp.page_name, mi.id
      `;
    db.query(sql, function (err, rows) {


        if (err) {
            console.error(err);
            return res.status(500).json({ error: 'Query Error' });
        }

        // rows 를 menuConfigurations 형태로 가공
        const menuData = {};
        rows.forEach(function (row) {
            const pageName = row.page_name;
            if (!menuData[pageName]) {
                menuData[pageName] = [];
            }
            menuData[pageName].push({
                href: row.href,
                text: row.label,
                icon: row.icon_class || null
            });
        });

        // JSON 응답
        res.json(menuData);

    });
});

router.get("/data", (req, res) => {
    db.query("SELECT * FROM departments order by row_key desc", (deptErr, deptRows) => {
        if (deptErr) {
            console.error("departments 쿼리 실패:", deptErr);
            return res.status(500).json({ error: "Failed to fetch departments" });
        }

        db.query("SELECT * FROM department_attributes", (attrErr, attrRows) => {
            if (attrErr) {
                console.error("attributes 쿼리 실패:", attrErr);
                return res.status(500).json({ error: "Failed to fetch attributes" });
            }

            const attrMap = {};
            attrRows.forEach((attr) => {
                attrMap[attr.row_key] = {
                    rowNum: attr.row_num,
                    checked: !!attr.checked,
                    disabled: !!attr.disabled,
                    checkDisabled: !!attr.check_disabled,
                    className: {
                        row: JSON.parse(attr.class_name_row || "[]"),
                        column: JSON.parse(attr.class_name_col || "{}")
                    }
                };
            });

            const result = deptRows.map((dept) => ({
                Key: dept.id,
                tpCd: dept.tp_cd,
                tpNm: dept.tp_nm,
                descCntn: dept.desc_cntn,
                useYn: dept.use_yn,
                createdAt: dept.created_at,
                view: dept.view,
                rowKey: dept.row_key,
                _attributes: attrMap[dept.row_key] || {}
            }));

            res.json(result);
        });
    });
});

router.post("/save", (req, res) => {
    const item = req.body;
    const { rowKey, tpCd, tpNm, descCntn, useYn, id = null,Key } = item;

    if (!rowKey || !tpCd || !tpNm) {
        return res.status(400).json({ error: "rowKey, tpCd, tpNm are required." });
    }

    const selectQuery = `SELECT 1 FROM departments WHERE row_key = ?`;

    const insertQuery = `
        INSERT INTO departments (id, tp_cd, tp_nm, desc_cntn, use_yn)
        VALUES (?, ?, ?, ?, ?)
    `;

    const updateQuery = `
        UPDATE departments
        SET tp_cd = ?, tp_nm = ?, desc_cntn = ?, use_yn = ?
        WHERE row_key = ?
    `;

    db.query(selectQuery, [rowKey], (selectErr, results) => {
        if (selectErr) {
            console.error("Select error:", selectErr);
            return res.status(500).json({ error: "Database select error" });
        }

        const exists = results.length > 0;

        if (exists) {
            // 기존 레코드 → UPDATE
            db.query(updateQuery, [tpCd, tpNm, descCntn, useYn,rowKey], (updateErr) => {
                if (updateErr) {
                    console.error("Update error:", updateErr);
                    return res.status(500).json({ error: "Update failed" });
                }
                return res.json({ message: "Updated successfully", type: "update" });
            });
        } else {
            // 신규 레코드 → INSERT
            db.query(insertQuery, [Key, tpCd, tpNm, descCntn, useYn], (insertErr) => {
                if (insertErr) {
                    console.error("Insert error:", insertErr);
                    return res.status(500).json({ error: "Insert failed" });
                }
                return res.json({ message: "Inserted successfully", type: "insert" });
            });
        }
    });
});





// 여러 rowKey 기반 삭제 API
router.post("/delete", (req, res) => {
    const { rowKeys } = req.body;

    if (!Array.isArray(rowKeys) || rowKeys.length === 0) {
        return res.status(400).json({ error: "rowKeys must be a non-empty array" });
    }

    // 삭제 쿼리
    const placeholders = rowKeys.map(() => '?').join(',');
    const deleteDeptQuery = `DELETE FROM departments WHERE row_key IN (${placeholders})`;


    const deleteAttrQuery = `DELETE FROM department_attributes WHERE row_key IN (${placeholders})`;

    // 먼저 attributes 삭제 → 이후 departments 삭제
    db.query(deleteAttrQuery, rowKeys, (err1) => {
        if (err1) {
            console.error("Failed to delete attributes:", err1);
            return res.status(500).json({ error: "Failed to delete attributes" });
        }

        db.query(deleteDeptQuery, rowKeys, (err2) => {

            if (err2) {
                console.error("Failed to delete departments:", err2);
                return res.status(500).json({ error: "Failed to delete departments" });
            }

            res.json({ message: "Rows deleted successfully", deleted: rowKeys });
        });
    });
});


// GET /api/permissions?memberId=test0001&menuPath=system.html
router.get('/permissions', function (req, res) {
    const { memberId, menuPath } = req.query;

    db.query(
        'SELECT id FROM menu_page WHERE page_name = ?',
        [menuPath],
        function (err, menuRows) {
            if (err) {
                console.error('메뉴 조회 실패:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            if (!menuRows || menuRows.length === 0) {
                return res.status(404).json({ message: 'Menu not found' });
            }

            const menuId = menuRows[0].id;

            db.query(
                `SELECT can_search, can_add, can_delete, can_reset_search, can_save, can_view
                 FROM member_menu_permission
                 WHERE member_id = ? AND menu_page_id = ?`,
                [memberId, menuId],
                function (err, permRows) {
                    if (err) {
                        console.error('권한 조회 실패:', err);
                        return res.status(500).json({ message: 'Internal server error' });
                    }

                    if (!permRows || permRows.length === 0) {
                        return res.json({
                            canSearch: false,
                            canAdd: false,
                            canDelete: false,
                            canResetSearch: false,
                            canSave: false,
                            canView: false
                        });
                    }

                    const perm = permRows[0];
                    return res.json({
                        canSearch: !!perm.can_search,
                        canAdd: !!perm.can_add,
                        canDelete: !!perm.can_delete,
                        canResetSearch: !!perm.can_reset_search,
                        canSave: !!perm.can_save,
                        canView: !!perm.can_view,
                    });
                }
            );
        }
    );
});




// GET /api/member-permissions
router.get('/member-permissions', function (req, res) {
    const query = `
        SELECT 
            mmp.id AS permission_id,
            mmp.member_id,
            mem.name AS member_name,
            mp.id AS menu_page_id,
            mp.page_name,
            mmp.can_search,
            mmp.can_add,
            mmp.can_delete,
            mmp.can_reset_search,
            mmp.can_save,
            mmp.can_view
        FROM member_menu_permission mmp
        JOIN member mem ON mmp.member_id = mem.id
        JOIN menu_page mp ON mmp.menu_page_id = mp.id
        ORDER BY mem.name, mp.page_name
    `;

    db.query(query, function (err, results) {
        if (err) {
            console.error('권한 목록 조회 실패:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        res.json(results);
    });
});


module.exports = router;