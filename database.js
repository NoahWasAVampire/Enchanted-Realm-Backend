const dotenv = require('dotenv');
dotenv.config();
let instance = null;

const mysql = require('mysql2/promise');

// Establish connection to database
const connection = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    maxIdle: 10,
    idleTimeout: 60000,
    queueLimit: 0
});

async function procedure(procedure, parameter) {
    let preparedParams = Array(parameter.length).fill('?').join(',');
    let [rows,fields] = await connection.query(`call ${procedure}(${preparedParams})`, parameter);
    return rows[0];
} 

exports.connection = connection;
exports.procedure = procedure;