const mongoose = require('mongoose')
import Product from './models/product';
import requestHelper from './requestHelper'
import { resolve } from 'path';
import { rejects } from 'assert';
const dateFormat = require('dateformat');

module.exports = {
    getCount: (done) => {
        let reqData, data
        reqData = {
            method: "get",
            headers: {
                "Authorization": "Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM",
                "Content-Type": "application/json"
            }
        }
        requestHelper.Request.http(reqData, "https://apis.haravan.com/com/products/count.json", (err, res) => {
            if (err) console.log(err)
            data = JSON.parse(res.response)
            return done(data)
        })
    },
    getData: (params, done) => {
        let page = 0, data = [], dataFinal = [], dataObject = [], reqData, count = 0, totalPage, dataProducts = [['id', 'title', 'variantsId', 'variantsTitle', 'price', 'sku']]
        totalPage = Math.ceil(params.count / 5)
        module.exports.getDataFinalPage(totalPage, 0, [], (getDataOfPage) => {
            for (let i in getDataOfPage) {
                for (let b = 0; b < getDataOfPage[i].variants.length; b++) {
                    let dataOfKey = []
                    let dataOfKeyObject = {}
                    dataOfKey.push(getDataOfPage[i].id)
                    dataOfKey.push(getDataOfPage[i].title)
                    dataOfKey.push(getDataOfPage[i].variants[b].id)
                    dataOfKey.push(getDataOfPage[i].variants[b].title)
                    dataOfKey.push(getDataOfPage[i].variants[b].price)
                    dataOfKey.push(getDataOfPage[i].variants[b].sku)

                    dataFinal.push(dataOfKey)

                    dataOfKeyObject.id = getDataOfPage[i].id
                    dataOfKeyObject.title = getDataOfPage[i].title
                    // dataOfKeyObject.sku = getDataOfPage[i].variants[b].sku
                    // dataOfKeyObject.barcode = getDataOfPage[i].variants[b].barcode
                    // dataOfKeyObject.inventory_quantity = getDataOfPage[i].variants[b].inventory_quantity
                    // dataOfKeyObject.price = getDataOfPage[i].variants[b].price

                    dataOfKeyObject.variants = getDataOfPage[i].variants[b]

                    dataObject.push(dataOfKeyObject)
                }
            }
            return done(dataObject)
            // for (let i in dataObject) {
            //     Product.collection.updateOne(
            //         { variantsId: dataObject[i].variantsId },
            //         {
            //             $set: {
            //                 id: dataObject[i].id,
            //                 title: dataObject[i].title,
            //                 variantsId: dataObject[i].variantsId,
            //                 variantsTitle: dataObject[i].variantsTitle,
            //                 price: dataObject[i].price,
            //                 sku: dataObject[i].sku
            //             }
            //         },
            //         { upsert: true }
            //     )
            // }
            // for (let i = 0; i < dataFinal.length; i++) {
            //     dataProducts.push(dataFinal[i])
            // }
            // return done(dataProducts)
        })
    },
    getDataOfPage: (page, done) => {
        let reqData, data
        reqData = {
            method: "get",
            headers: {
                "Authorization": "Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM",
                "Content-Type": "application/json"
            }
        }
        requestHelper.Request.http(reqData, `https://apis.haravan.com/com/products.json?fields=title,variants&limit=5&page=${page}`, async (err, res) => {
            data = JSON.parse(res.response)
            return done(data)
        })
    },
    getDataDatabase: (total, page, data, done) => {
        if (total < page) {
            return done(data)
        }
        Product.find({}).limit(5).skip(page).then((dataProduct) => {
            data = data.concat(dataProduct)
            page += 5
            module.exports.getDataDatabase(total, page, data, done)
        })
    },
    getDataFinalPage: (total, page, data, done) => {
        let reqData, dataParse
        if (total == page) {
            return done(data)
        }
        reqData = {
            method: "get",
            headers: {
                "Authorization": "Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM",
                "Content-Type": "application/json"
            }
        }
        page++
        requestHelper.Request.http(reqData, `https://apis.haravan.com/com/products.json?fields=title,variants&limit=5&page=${page}`, async (err, res) => {
            dataParse = JSON.parse(res.response)
            for (let i = 0; i < dataParse.products.length; i++) {
                data.push(dataParse.products[i])
            }
            module.exports.getDataFinalPage(total, page, data, done)
        })
    },
    getDataOfPageLimit: (data, params, done) => {
        let product = [], result = {}
        for (let i = params.count; i < params.getCountProduct; i++) {
            if (data[i] != null) product.push(data[i])
        }
        result.product = product
        return done(result)
    },
    getInfoProduct: (params, done) => {
        let reqData, dataParse, product

        reqData = {
            method: "get",
            headers: {
                "Authorization": "Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM",
                "Content-Type": "application/json"
            }
        }
        requestHelper.Request.http(reqData, `https://apis.haravan.com/com/products/${params.productId}.json`, async (err, res) => {
            if (res.statusCode != 200 || err) return done(null)
            dataParse = JSON.parse(res.response)
            product = dataParse.product
            for (let i = 0; i < product.variants.length; i++) {
                if (params.variantId == product.variants[i].id) {
                    product.variants = product.variants[i]
                }
            }
            return done(product)
        })
    },
    getOrders: (done) => {
        let reqData, dataParse, orders, listOrders = []
        return new Promise(async (resolve, reject) => {
            try {
                reqData = {
                    method: "get",
                    headers: {
                        "Authorization": "Bearer eZZ73UWykaOPRjx5ep7i2J6Jf3E_iNa6BoVEAdm7sOM",
                        "Content-Type": "application/json"
                    }
                }
                requestHelper.Request.http(reqData, `https://apis.haravan.com/com/orders.json`, async (err, res) => {
                    if (res.statusCode != 200 || err) return done(null)
                    dataParse = JSON.parse(res.response)
                    orders = dataParse.orders
                    for (let i = 0; i < orders.length; i++) {
                        let newOrders = {}
                        newOrders.id = orders[i].id
                        newOrders.created_at = dateFormat(orders[i].created_at)
                        newOrders.billing_address = `${orders[i].billing_address.address1} - ${orders[i].billing_address.district} - ${orders[i].billing_address.province}`
                        newOrders.total_price = orders[i].total_price
                        listOrders.push(newOrders)
                    }
                    return resolve(listOrders)
                })
            } catch (error) {
                return reject(error)
            }
        })
    },
    getOrderOfPageLimit: (data, params) => {
        let order = [], result = {}
        return new Promise(async (resolve, reject) => {
            try {
                for (let i = params.count; i < params.getCountOrder; i++) {
                    if (data[i] != null) order.push(data[i])
                }
                result.order = order
                return resolve(result)
            } catch (error) {
                return reject(error)
            }
        })
        //
    },
}