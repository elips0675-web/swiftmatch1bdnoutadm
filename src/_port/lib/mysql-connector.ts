import mysql from 'mysql2/promise';

// Для безопасности используйте переменные окружения, а не жестко заданные значения
const pool = mysql.createPool({
  host: 'localhost', // На cPanel обычно 'localhost'
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;