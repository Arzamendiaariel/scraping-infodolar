const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs')
require("dotenv").config()
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


async function init(){

    const $ = await request({
        uri: 'https://www.infodolar.com/cotizacion-dolar-localidad-rosario-provincia-santa-fe.aspx',
        transform: body => cheerio.load(body)
    })

    const compraBlue = $('#BluePromedio > tbody > tr > td:nth-child(2)').text().replace(/(\r\n|\n|\r|\s)/gm, "").split("$")[1].trim()
    const ventaBlue = $('#BluePromedio > tbody > tr > td:nth-child(3)').text().replace(/(\r\n|\n|\r|\s)/gm, "").split("$")[1].trim()

    const cotizacion= `Blue comprador: $ ${compraBlue}
    Blue vendedor: $ ${ventaBlue}`

    const msg = {
        to: ['someguy@gmail.com', 'estudio@gmail.com'],
        from: 'arzamendiaariel@gmail.com',
        subject: 'Cotización dolar blue',
        text: cotizacion,
        html: `<strong>${cotizacion}</strong>`,
      };

      await sgMail.send(msg)
          .then(() => console.log('Email sent successfully'))
          .catch(error => console.error(error.toString()));

    fs.writeFile("cotizacion.txt", cotizacion, "utf8", (err) => {
        if (err) throw err;
        console.log('The file has been saved!')})

}


init()

var now = new Date();
var millisTill10 = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 13, 6, 0, 0) - now;
if (millisTill10 < 0) {
     millisTill10 += 86400000; // it's after 10am, try 10am tomorrow.
}
setTimeout(function(){init()}, millisTill10);