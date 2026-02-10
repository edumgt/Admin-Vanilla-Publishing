const toInteger = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
};

module.exports = {
  user: process.env.DB_USER || 'edumgt',
  password: process.env.DB_PASSWORD || 'edumgt2250!',
  server: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kegtest',
  options: {
    encrypt: process.env.DB_ENCRYPT === 'true',
    trustServerCertificate: process.env.DB_TRUST_CERT !== 'false'
  },
  pool: {
    max: toInteger(process.env.DB_POOL_MAX, 10),
    min: toInteger(process.env.DB_POOL_MIN, 0),
    idleTimeoutMillis: toInteger(process.env.DB_IDLE_TIMEOUT_MS, 30000)
  }
};
