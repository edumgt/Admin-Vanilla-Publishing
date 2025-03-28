const express = require('express');
const path = require('path');
const cors = require('cors');

const sql = require('mssql');
const dbConfig = require('./dbConfig');

const jwt = require('jsonwebtoken');

const bodyParser = require('body-parser');
const databaseRoutes = require('./wms-api');

const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const swaggerDocument = require('./swagger.json');

const app = express();
const PORT = 3000;
const SECRET_KEY = 'edumgtedumgt'; // JWT 서명에 사용할 비밀 키

// JSON 바디 파싱 미들웨어
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

/* MSSQL */
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


////////////////////////////////////
app.get('/db/codes', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query('select * from t_code');

    res.json(result.recordset);
  } catch (err) {
    console.error('Query Execution Error:', err);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: err.message
    });
  }
});
app.get('/db/SurveyQstn', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query(
      `SELECT seq
      ,question
      ,kind
      ,type
      ,sort
      ,rd_seq
  FROM kegtest.dbo.T_Survey_Question
  order by rd_seq, sort , type`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Query Execution Error:', err);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: err.message
    });
  }
});
app.get('/db/SurveyRslt', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query(
      `select top 100 * from t_survey_result order by seq desc`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Query Execution Error:', err);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: err.message
    });
  }
});
app.get('/db/SurveyDate', async (req, res) => {
  try {
    let pool = await sql.connect(dbConfig);
    let result = await pool.request().query(
      `select * from t_survey_date order by seq desc`);

    res.json(result.recordset);
  } catch (err) {
    console.error('Query Execution Error:', err);
    res.status(500).json({
      success: false,
      message: 'Query execution failed',
      error: err.message
    });
  }
});

app.post('/db/SiteUser', async (req, res) => {
  const userid = req.body.userid || 'test0001';

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('userid', sql.VarChar, userid)
          .query('SELECT * FROM vwSiteUser WHERE userid = @userid');

      res.json({
          success: true,
          data: result.recordset
      });
  } catch (err) {
      console.error('DB Query Error:', err);
      res.status(500).json({
          success: false,
          message: 'Database query failed',
          error: err.message
      });
  }
});

const apiList = [
  { "url": "/api/member-permissions", "method": "GET" },
  { "url": "/db/codes", "method": "GET" },
  { "url": "/api/data", "method": "GET" },
  { "url": "/db/SurveyQstn", "method": "GET" },
  { "url": "/db/SurveyRslt", "method": "GET" },
  { "url": "/db/SiteUser", "method": "POST", "params": ["userid"] }
]



app.get('/api/list', (req, res) => {
  res.json(apiList);
});


app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));


app.use('/api', databaseRoutes);

// Swagger setup
const options = {
  swaggerDefinition: swaggerDocument,
  apis: ['./wms-api.js'], // Path to the API docs
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// 정적 파일을 서빙하기 위해 'public' 디렉토리를 사용
app.use(express.static(path.join(__dirname, 'public')));
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// app.use(express.static('dist'));


// 로그인 엔드포인트 (토큰 생성)
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // console.log(username);
  // console.log(password);

  // 실제로는 데이터베이스에서 사용자 인증을 해야 합니다.
  if (username === 'admin' && password === '1111') {
    const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
    return res.json({ token });
  }

  return res.status(401).json({ message: 'Invalid credentials' });
});

// JWT 검증 미들웨어
const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, SECRET_KEY, (err, user) => {
      if (err) {
        return res.sendStatus(403);
      }

      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
};

// 보호된 엔드포인트
app.get('/protected', authenticateJWT, (req, res) => {
  res.json({ message: 'This is a protected route', user: req.user });
});

app.listen(PORT, () => {
  console.log("#");
});
