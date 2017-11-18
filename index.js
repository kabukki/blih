const axios = require('axios');
const crypto = require('crypto');
const endpoints = require('./endpoints');

class Blih {

    constructor (email, password) {
        this.email = email;
        this.password = password;
        this.token = crypto.createHash('sha512').update(password).digest('hex');
        this.api = axios.create({
            baseURL: 'https://blih.epitech.eu/',
            headers: { 'Content-Type': 'application/json' }
        });
        this.api.interceptors.response.use(
            response => response.data,
            error => Promise.reject({
                status: error.response.status,
                statusText: error.response.statusText,
                data: error.response.data
            })
        );
        endpoints.forEach(endpoint => {
            this[endpoint.name] = (...args) => this.call(endpoint, ...args);
        });
    }

    call (endpoint, ...args) {
        let body = { user: this.email };

        if (endpoint.data) {
            body.data = endpoint.data(...args);
        }

        body.signature = crypto.createHmac('sha512', this.token)
            .update(this.email)
            .update(body.data ? JSON.stringify(body.data, null, 4) : '')
            .digest('hex');

        return this.api.request({
            method: endpoint.method,
            url: endpoint.path(...args),
            data: body
        });
    }

};

module.exports = Blih;
