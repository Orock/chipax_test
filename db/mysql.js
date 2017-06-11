let mysql = require('promise-mysql');

// Datos del server de prueba
let host = 'localhost';
let user = 'root';
let password = '123';
let database = 'chipax';

// Si esta en heroku, toma los datos de la db
if (process.env.CLEARDB_DATABASE_URL != undefined){
  let str = process.env.CLEARDB_DATABASE_URL;
  let regex = /mysql:\/\/(.*):(.*)@(.*)\/(.*)\?/i;
  let res = regex.exec(str);

  host = res[3];
  user = res[1];
  password = res[2];
  database = res[4];
}

// Conexion a la db
let pool = mysql.createPool({
  host,
  user,
  password,
  database,
  connectionLimit: 10
});

module.exports = {pool};