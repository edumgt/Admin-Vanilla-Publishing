const express = require('express');
const path = require('path');
const cors = require('cors');

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


app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));


// 📌 데이터베이스 API 연동
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
