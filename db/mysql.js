let mysql = require('promise-mysql');
let pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: '123',
  database: 'chipax',
  connectionLimit: 10
});

module.exports = {pool};