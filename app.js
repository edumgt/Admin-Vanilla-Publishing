// app.js
const express = require('express');
const bodyParser = require('body-parser');
const sql = require('mssql');
const dbConfig = require('./dbConfig');

const app = express();
const port = 3000;

// JSON, urlencoded 파싱 (Express 4.16+에서는 body-parser 없이도 사용 가능)
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 1) DB 연결 테스트용 (GET)
app.get('/db/connect', async (req, res) => {
  try {
    // 1. 데이터베이스 커넥션 생성
    let pool = await sql.connect(dbConfig);

    // 2. 테스트로 간단한 쿼리 실행
    let result = await pool.request().query('SELECT GETDATE() as currentTime');

    // 3. 결과 반환
    res.json({
      success: true,
      message: 'DB Connection Succeeded',
      data: result.recordset
    });
  } catch (err) {
    console.error('DB Connection Error:', err);
    res.status(500).json({
      success: false,
      message: 'DB Connection Failed',
      error: err.message
    });
  }
});

// 2) 동적으로 DB 설정값을 받아서 연결하는 예시 (POST)
app.post('/db/dynamicConnect', async (req, res) => {
  const { host, user, password, database } = req.body;

  // 요청 바디를 기반으로 동적 DB 설정
  const dynamicConfig = {
    user: user,
    password: password,
    server: host,
    database: database,
    options: {
      encrypt: false,
      trustServerCertificate: true
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    }
  };

  try {
    let pool = await sql.connect(dynamicConfig);
    let result = await pool.request().query('SELECT GETDATE() as currentTime');

    res.json({
      success: true,
      message: 'Dynamic DB Connection Succeeded',
      data: result.recordset
    });
  } catch (err) {
    console.error('Dynamic DB Connection Error:', err);
    res.status(500).json({
      success: false,
      message: 'Dynamic DB Connection Failed',
      error: err.message
    });
  }
});

// 3) 쿼리 실행 예시 (POST)
app.post('/db/query', async (req, res) => {
  const { query } = req.body;  // 실행할 쿼리를 요청 body에서 받아온다고 가정
  
  try {
    // 기존에 설정된 dbConfig로 커넥션
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query(query);

    res.json({
      success: true,
      message: 'Query executed successfully',
      rowCount: result.rowsAffected,
      data: result.recordset
    });
  } catch (err) {
    console.error('Query Execution Error:', err);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: err.message
    });
  }
});

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
