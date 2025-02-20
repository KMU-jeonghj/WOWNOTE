const db = require('mariadb')

const pool = db.createPool({
    host : 'localhost',
    port : '3306',
    user: 'root',
    password: 'root',
    database: "WOWNOTE"
})

async function getConnection() {
    return pool.getConnection();
}

module.exports = {getConnection}