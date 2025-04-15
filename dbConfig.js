// dbConfig.js
module.exports = {
    user: process.env.DB_USER || 'sa',
    password: process.env.DB_PASSWORD || '1234',
    server: process.env.DB_HOST || 'localhost:8787',
    database: process.env.DB_NAME || 'kegtest',
    // MSSQL에 필요한 추가 설정
    options: {
      encrypt: false,  // 클라이언트에서 암호화 여부 (MSSQL 환경에 따라 변경)
      trustServerCertificate: true // SSL 사용 시 필요 여부
    },
    // 추가 Pool 옵션
    pool: {
      max: 10,         // 최대 연결 수
      min: 0,          // 최소 연결 수
      idleTimeoutMillis: 30000 // 커넥션 유휴 시간
    }
  };
  