import express from "express";
import dataShopHelper from "./dataShopHelper";
import Product from "./models/product";
import { CONNREFUSED } from "dns";
import { count } from "console";
import { get } from "request";
import requestHelper from "./requestHelper";
const xlsxFile = require("read-excel-file/node");
const parser = require("xml2json");
const xlsx = require("node-xlsx");
const fs = require("fs");
const path = require("path");
const xmlwriter = require("xml-writer");
var request = require('request');

const postRouter = express.Router();


// postRouter.get('/dataShop/excel', (req, res) => {
//     let getData
//     try {
//         dataShopHelper.getCount((getCount) => {
//             if (typeof (getCount) != "object") return res.json({ message: "Loi data" })
//             dataShopHelper.getData(getCount, (getData) => {
//                 if (typeof (getData) != "object") return res.json({ message: "Loi data" })
//                 var buffer = xlsx.build([{ name: "List Products", data: getData }]);

//                 fs.writeFile(`${__dirname}/myFile.xlsx`, buffer, function (err) {
//                     if (err) return console.log(err);
//                 });
//                 res.json({ message: "Thanh cong" })
//             })
//         })
//     }
//     catch (error) {
//         console.log(error)
//     }
// });

// postRouter.get('/dataShop/getDbExport', (req, res) => {
//     let dataProducts = [['id', 'title', 'variantsId', 'variantsTitle', 'price', 'sku']], buffer
//     try {
//         Product.count({}).then((count) => {
//             if (typeof (count) != "number") return res.json({ message: "Loi data" })
//             dataShopHelper.getDataDatabase(count, 0, [], (data) => {
//                 if (typeof (data) != "object") return res.json({ message: "Loi data" })
//                 var xw = new xmlwriter
//                 let Table = xw.startElement('Table').text('\n')
//                 let Row = Table.startElement('Row').text('\n')

//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('id').endElement().endElement().text('\n')
//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('title').endElement().endElement().text('\n')
//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('variantsId').endElement().endElement().text('\n')
//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('variantsTitle').endElement().endElement().text('\n')
//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('price').endElement().endElement().text('\n')
//                 Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text('sku').endElement().endElement().text('\n')
//                 Row.endElement().text('\n')

//                 for (let i in data) {
//                     let Row = xw.startElement('Row').text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', `type`).text(`${data[i].id}`).endElement().endElement().text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text(`${data[i].title}`).endElement().endElement().text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text(`${data[i].variantsId}`).endElement().endElement().text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text(`${data[i].variantsTitle}`).endElement().endElement().text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'Number').text(`${data[i].price}`).endElement().endElement().text('\n')
//                     Row.startElement('Cell').startElement('Data').writeAttribute('Type', 'String').text(`${data[i].sku}`).endElement().endElement().text('\n')
//                     Row.endElement().text('\n')

//                     let dataOfKey = []
//                     dataOfKey.push(data[i].id)
//                     dataOfKey.push(data[i].title)
//                     dataOfKey.push(data[i].variantsId)
//                     dataOfKey.push(data[i].variantsTitle)
//                     dataOfKey.push(data[i].price)
//                     dataOfKey.push(data[i].sku)

//                     dataProducts.push(dataOfKey)
//                 }
//                 // EXPORT FILE EXCEL
//                 buffer = xlsx.build([{ name: "List Products", data: dataProducts }]);
//                 fs.writeFile(`${__dirname}/getDB.xlsx`, buffer, (err) => {
//                     if (err) return console.log(err);
//                     console.log("The file Excel was saved!");
//                 });
//                 // EXPORT FILE XML
//                 fs.writeFile(`${__dirname}/fileXml.xml`, xw.toString(), (err) => {
//                     if (err) return console.log(err)
//                     console.log("The file XML was saved!");
//                 });

//                 res.json({ message: "Thanh cong" })
//             })

//         })
//     }
//     catch (error) {
//         console.error(`ERROR: ${error}`)
//     }
// })

// postRouter.get('/dataShop/getFileSaveDb', (req, res) => {
//     let result = []
//     try {
//         if (req.query.type == 'excel') {
//             console.log("Read File Excel")
//             xlsxFile(`${__dirname}/getDB2.xlsx`).then((data) => {
//                 for (let i = 1; i < data.length; i++) {
//                     const obj = {}
//                     for (let a = 0; a < data[0].length; a++) {
//                         obj[data[0][a]] = data[i][a]
//                     }
//                     result.push(obj)
//                 }
//                 for (let i in result) {
//                     Product.collection.updateOne(
//                         { variantsId: result[i].variantsId },
//                         {
//                             $set: {
//                                 id: result[i].id,
//                                 title: result[i].title,
//                                 variantsId: result[i].variantsId,
//                                 variantsTitle: result[i].variansTitle,
//                                 price: result[i].price,
//                                 sku: result[i].sku
//                             }
//                         },
//                         { upsert: true }
//                     )
//                 }
//                 console.log("FILE EXCEL IMPORT DATABASE SUCCESS")
//                 res.json({ message: "Thanh cong" })
//             })

//         }
//         else {
//             console.log("Read File xml")
//             let json = parser.toJson(fs.readFileSync(`${__dirname}/fileXml.xml`, { encoding: 'utf-8' }))
//             let parse = JSON.parse(json)
//             let dataParse = parse.Table.Row
//             for (let i = 1; i < dataParse.length; i++) {
//                 for (let a in dataParse[i]) {
//                     const obj = {}
//                     for (let b = 0; b < dataParse[0][a].length; b++) {
//                         obj[dataParse[0][a][b].Data.$t] = dataParse[i][a][b].Data.$t
//                     }
//                     result.push(obj)
//                 }
//             }
//             for (let i in result) {
//                 Product.collection.updateOne(
//                     { variantsId: result[i].variantsId },
//                     {
//                         $set: {
//                             id: result[i].id,
//                             title: result[i].title,
//                             variantsId: result[i].variantsId,
//                             variantsTitle: result[i].variantsTitle,
//                             price: Number(result[i].price),
//                             sku: result[i].sku
//                         }
//                     },
//                     { upsert: true }
//                 )
//             }
//             console.log("FILE XML IMPORT DATABASE SUCCESS")
//             res.json({ message: "Thanh cong" })
//         }

//     } catch (error) {
//         console.error(`ERROR: ${error}`)
//     }
// })

postRouter.get("/", (req, res) => {
    res.sendFile(path.join(__dirname + "/public/src/index.html"));
});

postRouter.get("/product", (req, res) => {
    let getData,
        params,
        result = [],
        totalPage;
    try {
        params = req.query;
        params.count = params.limit * params.page - params.limit;
        params.getCountProduct = params.limit * params.page;
        dataShopHelper.getCount((getCount) => {
            if (typeof getCount != "object") return res.json({ message: "Loi data" });
            dataShopHelper.getData(getCount, (getData) => {
                if (!params.limit) return res.send(getData)
                dataShopHelper.getDataOfPageLimit(getData, params, (data) => {
                    data.totalPage = Math.ceil(getData.length / params.limit);
                    return res.send(data);
                });
            });
        });
    } catch (error) {
        console.log(error);
    }
});

postRouter.get("/product/info/:productId/:variantId", (req, res) => {
    let getData,
        params,
        result = [],
        totalPage;
    try {
        params = req.params;
        dataShopHelper.getInfoProduct(params, (data) => {
            if (!data) return res.json({ message: "Sản phẩm không tồn tại" });
            return res.send(data);
        });
    } catch (error) {
        console.log(error);
    }
});

postRouter.get('/orders', async (req, res) => {
    let params, data, dataOfPage
    try {
        params = req.query
        params.count = (params.limit * params.page - params.limit)
        params.getCountOrder = params.limit * params.page
        data = await dataShopHelper.getOrders()
        dataOfPage = await dataShopHelper.getOrderOfPageLimit(data, params)
        dataOfPage.totalPage = Math.ceil(data.length / params.limit)
        return res.status(200).send(dataOfPage)
    }
    catch (error) {
        console.log(error)
    }
})

postRouter.post('/orders/create', async (req, res) => {
    let data
    var options = {
        'method': 'POST',
        'url': 'https://apis.haravan.com/com/orders.json',
        'headers': {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM'
        },
        body: JSON.stringify(req.body)

    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        data = JSON.parse(response.body)
        res.send(data)
    });
})

//
export default postRouter;
