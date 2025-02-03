const express = require('express');
const path = require('path');
const cors = require('cors');
const bodyParser = require('body-parser');
const databaseRoutes = require('./wms-api');

const app = express();
const PORT = 3000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

app.use(bodyParser.json());

// 📌 데이터베이스 API 연동
app.use('/api', databaseRoutes);


// 정적 파일을 서빙하기 위해 'public' 디렉토리를 사용
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log("#");
});
