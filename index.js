const request = require('request');
const crypto = require('crypto');
const endpoints = require('./endpoints');

const options = {
    baseUrl: 'https://blih.epitech.eu/',
    timeout: 10000
};

module.exports = class Blih {

    constructor (email, password) {
        this.email = email;
        this.password = password;
        this.token = crypto.createHash('sha512').update(password).digest('hex');
        this.api = request.defaults(options);

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

        return new Promise((resolve, reject) => {
            this.api({
                method: endpoint.method,
                uri: endpoint.path(...args),
                json: body
            }, (err, response, body) => {
                if (err || body.error) {
                    reject(body);
                } else {
                    resolve(body);
                }
            });
        });
    }

};
