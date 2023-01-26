const cheerio = require('cheerio');
const request = require('request-promise');
const fs = require('fs')

// https://www.infodolar.com/cotizacion-dolar-localidad-rosario-provincia-santa-fe.aspx

async function init(){

    const $ = await request({
        uri: 'https://www.infodolar.com/cotizacion-dolar-localidad-rosario-provincia-santa-fe.aspx',
        transform: body => cheerio.load(body)
    })
    // const websiteTitle = $('title').text().trim()
    // console.log(websiteTitle)
    // const titulos= $('.superTitulo').text().trim()
    // console.log(titulos)
    // const Blue = $('#BluePromedio').find('.colCompraVenta').html()
    // console.log(Blue)
    const compraBlue = $('#BluePromedio > tbody > tr > td:nth-child(2)').text().replaceAll("  ", "").replaceAll("\n", "").split("$")[1].trim()
    const ventaBlue = $('#BluePromedio > tbody > tr > td:nth-child(3)').text().replaceAll("  ", "").replaceAll("\n", "").split("$")[1].trim()
    
    const cotizacion= `Blue comprador: $ ${compraBlue}
    Blue vendedor: $ ${ventaBlue}`

    fs.writeFile("cotizacion.txt", cotizacion, "utf8", (err) => {
        if (err) throw err;
        console.log('The file has been saved!')})


}

init()