var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

const request = require('request');
const crypto = require('crypto');
const endpoints = require('./endpoints');

const options = {
    baseUrl: 'https://blih.epitech.eu/',
    timeout: 10000
};

const fatalErrors = ['Bad token', 'Repository not found'];

module.exports = class Blih {

    constructor(credentials) {
        if (!credentials) {
            throw 'Missing credentials';
        } else if (!credentials.email) {
            throw 'Email is mandatory to authenticate';
        } else if (!credentials.password && !credentials.token) {
            throw 'A password or token is needed to authenticate';
        }

        this.email = credentials.email;
        this.token = credentials.token ? credentials.token : crypto.createHash('sha512').update(credentials.password).digest('hex');
        this.api = request.defaults(options);

        endpoints.forEach(endpoint => {
            this[endpoint.name] = (...args) => this.call(endpoint, ...args);
        });
    }

    call(endpoint, ...args) {
        let body = { user: this.email };

        if (endpoint.data) {
            body.data = endpoint.data(...args);
        }

        body.signature = crypto.createHmac('sha512', this.token).update(this.email).update(body.data ? JSON.stringify(body.data, null, 4) : '').digest('hex');

        return new Promise((resolve, reject) => {
            this.api({
                method: endpoint.method,
                uri: endpoint.path(...args),
                json: body
            }, (err, response, body) => {
                // Network error occurred
                if (err) {
                    reject(err);
                    // Unsuccessful request
                } else if (response.statusCode < 200 || response.statusCode >= 300) {
                    // API returned an error
                    if (body.error) {
                        // Only ignore non-fatal errors
                        if (!fatalErrors.includes(body.error) && endpoint.onError) {
                            resolve(endpoint.onError());
                        } else {
                            reject(body.error);
                        }
                        // API did not specify an error (probably 500)
                    } else {
                        reject(response.statusCode + ' ' + response.statusMessage);
                    }
                    // Successful request
                } else {
                    resolve(endpoint.transform ? endpoint.transform(body) : body);
                }
            });
        });
    }

    static ping() {
        return new Promise((resolve, reject) => {
            request(_extends({}, options, {
                uri: '/'
            }), (err, response, _body) => {
                if (err) {
                    reject(err);
                } else if (response.statusCode < 200 || response.statusCode >= 300) {
                    reject(response.statusCode);
                } else {
                    resolve(response.statusCode);
                }
            });
        });
    }

};