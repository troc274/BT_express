import express from "express";
import dataShopHelper from "./dataShopHelper";
import Product from "./models/product";
import { CONNREFUSED } from "dns";
import { count } from "console";
import { get } from "request";
const xlsxFile = require("read-excel-file/node");
const parser = require("xml2json");
const xlsx = require("node-xlsx");
const fs = require("fs");
const path = require("path");
const xmlwriter = require("xml-writer");

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

postRouter.get("/showData/:userId", (req, res) => {
  let listUsers = [
    { id: 1, name: "Nguyễn Văn A" },
    { id: 2, name: "Hoàng Thị B" },
    { id: 3, name: "Phan Huy C" },
  ];
  let userId = req.params.userId;

  let user = listUsers.find((u) => u.id == userId);
  if (user) {
    res.send(user.name);
  } else res.send("User not found!!!");
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

postRouter.get("/product/info", (req, res) => {
  let getData,
    params,
    result = [],
    totalPage;
  try {
    params = req.query;
    dataShopHelper.getInfoProduct(params, (data) => {
      if (!data) return res.json({ message: "Sản phẩm không tồn tại" });
      return res.send(data);
    });
  } catch (error) {
    console.log(error);
  }
});

export default postRouter;
