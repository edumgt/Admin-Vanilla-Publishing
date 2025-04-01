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

/**
 * @swagger
 * /db/connect:
 *   get:
 *     summary: DB 연결 테스트
 *     description: 기본 설정된 DB에 연결한 후 현재 시간을 반환합니다.
 *     responses:
 *       200:
 *         description: 연결 성공
 *       500:
 *         description: 연결 실패
 */
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

/**
 * @swagger
 * /db/query:
 *   post:
 *     summary: DB 쿼리 실행
 *     description: 요청 본문에 포함된 SQL 쿼리를 실행합니다.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               query:
 *                 type: string
 *                 example: SELECT * FROM some_table
 *     responses:
 *       200:
 *         description: 쿼리 실행 결과 반환
 *       500:
 *         description: 쿼리 실행 실패
 */

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

/**
 * @swagger
 * /db/SiteUser:
 *   post:
 *     summary: 사이트 사용자 조회
 *     description: 사용자 ID를 기반으로 해당 사용자의 사이트 목록을 조회합니다.
 *     consumes:
 *       - application/json
 *     parameters:
 *       - in: body
 *         name: body
 *         description: 사용자 ID
 *         required: false
 *         schema:
 *           type: object
 *           properties:
 *             userid:
 *               type: string
 *               example: test0001
 *     responses:
 *       200:
 *         description: 조회 성공
 *       500:
 *         description: 조회 실패
 */
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

app.post('/db/PlaceUser', async (req, res) => {
  const userid = req.body.userid || 'test0001';

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('userid', sql.VarChar, userid)
          .query('SELECT * FROM vwPlaceUser WHERE userid = @userid');

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

app.post('/db/SitePlace', async (req, res) => {
  const sitecode = req.body.sitecode || '01';

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('sitecode', sql.VarChar, sitecode)
          .query('SELECT * FROM vwSitePlace WHERE sitecode = @sitecode');
      

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

app.post('/listbox/SitePlace', async (req, res) => {
  const sitecode = req.body.sitecode || '01';

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('sitecode', sql.VarChar, sitecode)
          .query('SELECT placeseq opt,placename val FROM vwSitePlace WHERE sitecode = @sitecode');
      

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


app.post('/listbox/SiteUser', async (req, res) => {
  const userid = req.body.userid || 'test0001';

  try {
      const pool = await sql.connect(dbConfig);
      const result = await pool.request()
          .input('userid', sql.VarChar, userid)
          .query('SELECT sitecode opt, sitename val FROM vwSiteUser WHERE userid = @userid');

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
  { "url": "/api/member-permissions", "method": "GET" ,description: '권한 목록'},
  { "url": "/db/codes", "method": "GET" ,description: '권한 목록'},
  { "url": "/api/data", "method": "GET" ,description: '권한 목록'},
  { "url": "/api/glos", "method": "GET" ,description: '권한 목록'},
  { "url": "/db/SurveyQstn", "method": "GET" ,description: '권한 목록'},
  { "url": "/db/SurveyRslt", "method": "GET" ,description: '권한 목록'},
  { "url": "/db/SiteUser", "method": "POST", "params": ["userid"] ,description: '권한 목록'},
  { "url": "/db/PlaceUser", "method": "POST", "params": ["userid"] ,description: '권한 목록'},
  { "url": "/db/SitePlace", "method": "POST", "params": ["sitecode"] ,description: '권한 목록'},
  { "url": "/listbox/SitePlace", "method": "POST", "params": ["sitecode"] ,description: '계열-지점 목록'},
  { "url": "/listbox/SiteUser", "method": "POST", "params": ["userid"] ,description: '사용자별 Site 접근 목록'},
]



app.get('/api/list', (req, res) => {
  res.json(apiList);
});


app.use(cors({
  origin: function (origin, callback) {
    const allowedOrigins = ['http://localhost:3000', 'http://127.0.0.1:3000'];
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));


app.use('/api', databaseRoutes);

// Swagger setup
const options = {
  swaggerDefinition: swaggerDocument,
  apis: ['./wms-api.js','./server.js'], // Path to the API docs
};
const specs = swaggerJsdoc(options);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));


// 정적 파일을 서빙하기 위해 'public' 디렉토리를 사용
// app.use(express.static(path.join(__dirname, 'public')));
// app.get('/', (req, res) => {
//   res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.use(express.static('dist'));


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
  console.log('Server is running at: http://localhost:3000');
});
