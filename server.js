const express = require('express');
const {pool} = require('./db/mysql');
const {scraper} = require('./scraper');

const app = express();
const port = process.env.PORT || 3000;

const url = "http://www.bcentral.cl/es/faces/home?_adf.ctrl-state=9aox25baj_4&_afrLoop=396600690702287&_afrWindowMode=0&_afrWindowId=null#!%40%40%3F_afrWindowId%3Dnull%26_afrLoop%3D396600690702287%26_afrWindowMode%3D0%26_adf.ctrl-state%3Dbou7q7sgj_169";

app.get('/', (req, res) => {

  let newData
  pool.getConnection().then((conn) => {
    connection = conn;
    // Verificamos que los datos que existan para no volver a scrapear
    let query = `SELECT id FROM currencies WHERE DATE(created_at) = CURDATE()`;
    connection.query(query).then((rows) => {
      
      if (rows.length == 0){        
        // Si no hay datos para el dia, se scrapea
        scraper(url).then((data) => {
          // No hace nada, no se necesita mostrar el dato nuevo
        }).catch((errorMessage) => {
          return res.send(errorMessage);
        });
      }

    });

  }).then(() => {
    // Devuelve los datos anteriores
    let query = `SELECT uf, usd, eur, created_at FROM currencies WHERE DATE(created_at) < CURDATE() ORDER BY created_at DESC`;
    connection.query(query).then((rows) => {
      return res.send(rows);
    }).catch( (error) => {
      return res.send(error);
    });
  }).catch( (error) => {
    return res.send(error);
  });
  
});

app.get('/todos', (req, res) => {
  // Eliminamos los datos de la db para probar que funciona
  let query = `SELECT uf, usd, eur, created_at FROM currencies ORDER BY created_at DESC`;
  pool.getConnection().then((connection) => {  
    connection.query(query).then((rows) => {
      return res.send(rows);
    }).catch((errorMessage) => {
      return res.send(errorMessage);
    });
  });
});

app.get('/truncate', (req, res) => {
  // Eliminamos los datos de la db para probar que funciona
  let query = `TRUNCATE currencies`;
  pool.getConnection().then((connection) => {  
    connection.query(query).then((rows) => {
      return res.send('Se eliminaron los datos');
    }).catch((errorMessage) => {
      return res.send(errorMessage);
    });
  });
});

app.listen(port, () => {
  console.log(`Iniciado en el puerto ${port}`);
});

module.exports = {app};