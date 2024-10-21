const mysql=require('mysql2/promise');
require('dotenv').config();
const pool = mysql.createPool({
    host: process.env.HOST,
    port: process.env.PORT,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
    connectionLimit: 200
});

module.exports = pool;