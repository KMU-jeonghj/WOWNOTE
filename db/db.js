const mysql = require('mysql')
const mariadb = require('mariadb')

const conn = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : 'root',
    database : 'wownote',
    port : '33062',
    dateStrings : true
})


module.exports = conn