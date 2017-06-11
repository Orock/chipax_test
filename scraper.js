const request = require('request');
const cheerio = require('cheerio');
const {pool} = require('./db/mysql');

let scraper = (url) => {

  let uf, utm, usd, eur;
  console.log(usd);
  return new Promise((resolve, reject) => {
    request(url, (error, response, body) => {
      if (!error) {
        
        let $ = cheerio.load(body),
          currencies = $(".tabla_modulo_indicadores tr");
        
        currencies.each( (i, currency) => {
          let lines = $(currency).find('span.texto');

          // console.log($(lines[0]).html() + ' -> ' + $(lines[lines.length-1]).html())

          // Se valida que realmente sea la moneda, en algun momento podria no estar una
          switch($(lines[0]).html().trim()) {
            case 'UF':
              uf = $(lines[lines.length-1]).html().replace('.', '').replace(',', '.');
              break;
            case 'D&#xF3;lar Observado':
              if(usd == undefined){ // para tomar el primer dato del dolar
                usd = $(lines[lines.length-1]).html().replace('.', '').replace(',', '.');
              }
              break;
            case 'Euro':
              eur = $(lines[lines.length-1]).html().replace('.', '').replace(',', '.');
              break;
          }
        });

        let query = `INSERT INTO currencies (uf, usd, eur, created_at) VALUES ('${uf}', '${usd}', '${eur}', now())`;
        pool.getConnection().then( (connection) => {
          connection.query(query).then((rows) => {

            resolve ({
              'uf': uf,
              'usd': usd,
              'eur': eur,
            });

          })
        }).catch( (error) => {
           reject(error);
        });

      } else {
        reject (error);
      }
    });
  });

}

module.exports = {scraper};