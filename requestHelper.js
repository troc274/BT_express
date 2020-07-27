'use strict'
const request = require("request")
class Request {
    constructor(req, params = {}, schema = {}, action = null) {
        this.query = req.query
        this.payload = req.payload
        this.path = req.params
        this.params = params
        this.action = action
        this.schema = schema
        this.result = null
    }
    get allParams() {
        return this.SetParams()
    }
    SetParams() {
        if (this.query) for (var k in this.query) this.params[k] = this.query[k]
        if (this.payload) for (var k in this.payload) if (k != "code" && k != "phone") this.params[k] = this.payload[k]
        if (this.path) for (var k in this.path) this.params[k] = this.path[k]
        return this.params
    }
    static http(dataRequest, url, cb) {
        this.action = request.get
        this.result = {}
        if (!dataRequest) dataRequest = {}
        if (dataRequest.sms)
            this.schema = {
                url: url,
                timeout: 1000 * 15,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            }
        else
            this.schema = {
                url: url,
                timeout: 1000 * 15,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        if (dataRequest) {
            if (dataRequest.upload) {
                delete dataRequest.upload
                this.schema.formdataRequest = dataRequest
            } else if (dataRequest.push) {
                let dataSms = [], data
                this.schema.method = dataRequest.method
                if (dataRequest.sms) {
                    delete dataRequest.push
                    delete dataRequest.sms
                    dataSms = [dataRequest]
                    this.schema.form = 'data=' + JSON.stringify(dataSms)
                }
                else this.schema.body = JSON.stringify(dataRequest)
            } else {
                this.schema.form = dataRequest
            }
            if (dataRequest.oauth2) {
                this.schema.headers['Authorization'] = dataRequest.oauth2
                delete this.schema.form.oauth2
            }
            if (dataRequest.auth) this.schema.headers['api-key'] = dataRequest.auth
            if (dataRequest.error) this.schema.form = dataRequest
            if (dataRequest.sys) delete this.schema.url
            if (dataRequest.method == "delete") this.action = request.delete
            if (dataRequest.method == "post") {
                this.action = request.post
            }
            if (dataRequest.headers) this.schema.headers = dataRequest.headers
            delete dataRequest.method
            delete dataRequest.auth
        }
        // setTimeout(() => {
        //     return cb(`Connect to ${url} time out`)
        // }, 1000 * 15);
        this.action(this.schema, (err, http, res) => {
            if (err && err.connect == false)
                return cb(`Connect ${url} time out `)
            if (err) return cb(err)
            this.result = {
                response: res,
                statusCode: http.statusCode
            }
            return cb(null, this.result)
        })
    }
}

module.exports = {
    Request: Request
    // something else
}