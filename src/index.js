const axios = require('axios');
const crypto = require('crypto');

const options = {
    baseURL: 'https://blih.epitech.eu/',
    timeout: 10000
};

/*
 * Interceptors
 */
function responseDataInterceptor (response) {
    return response;
}

function responseErrorInterceptor (error) {
    if (error.response && error.response.data.error) {
        return Promise.reject(error.response.data.error);
    } else {
        return Promise.reject(error.message);
    }
}

// Always use Node.js adapter
axios.defaults.adapter = require('axios/lib/adapters/http');

/**
 * Blih API
 * @class Blih
 */
class Blih {

    constructor (credentials) {
        if (!credentials) {
            throw 'Missing credentials';
        } else if (!credentials.email) {
            throw 'Email is mandatory to authenticate';
        } else if (!credentials.password && !credentials.token) {
            throw 'A password or token is needed to authenticate';
        }

        /**
         * Email of the user
         * @type {String}
         */
        this.email = credentials.email;
        /**
         * Token to use when communicating with the API
         * @type {String}
         */
        this.token = credentials.token ? credentials.token :
            crypto.createHash('sha512').update(credentials.password).digest('hex');

        this.api = axios.create(options);
        this.api.interceptors.response.use(responseDataInterceptor, responseErrorInterceptor);
    }

    /**
     * Create a repository
     * @param  {String} repository  Name of the new repository
     * @return {Promise} description
     */
    async createRepository (repository) {
        const data = {
            name: repository,
            type: 'git'
        };

        return (await this.call('post', '/repositories', data)).data.message;
    }

    /**
     * Delete a repository
     * @async
     * @param  {String} repository Name of the repository to delete
     * @return {Promise} description
     */
    async deleteRepository (repository) {
        repository = encodeURIComponent(repository);
        return (await this.call('delete', `/repository/${repository}`)).data.message;
    }

    /**
     * A brief summary of a repository
     * @typedef {Object} Blih~PartialRepository
     * @property {String} name - The name of the repository
     * @property {String} url - The URL that the API uses for this repository
     * @property {String} uuid - UUID of the repository
     */

    /**
     * List repositories
     * @async
     * @return {PartialRepository[]} the repositories you own
     */
    async listRepositories () {
        const list = (await this.call('get', '/repositories')).data.repositories;
        return Object.keys(list)
            .filter(r => r.length).sort()
            .map(r => ({
                name: r,
                url: list[r].url,
                uuid: list[r].uuid
            }));
    }

    /**
     * A detailed summary of a repository
     * @typedef {Object} Blih~Repository
     * @property {String} name - The name of the repository
     * @property {String} url - The URL that the API uses for this repository
     * @property {Number} creation_time - POSIX creation time of the repository
     * @property {String} uuid - UUID of the repository
     * @property {String} description - UUID of the repository
     * @property {boolean} public - Visibility of the repository
     */

    /**
     * Get information about a repository
     * @async
     * @return {Repository} information about the repository
     */
    async repositoryInfo (repository) {
        repository = encodeURIComponent(repository);
        const info = (await this.call('get', `/repository/${repository}`)).data.message;
        info.name = repository;
        info.creation_time = Number(info.creation_time);
        info.public = (info.public !== 'False');
        return info;
    }

    /**
     * A collaborator associated with their rights on a repository
     * @typedef {Object} Blih~ACL
     * @property {String} name - Name of the collaborator
     * @property {String} rights - one or many of 'a' (admin), 'r' (read) or 'w' (write)
     */

    /**
    * Get ACL of a repository
    * @async
    * @return {ACL[]} the collaborators on this repository
    */
    async getACL (repository) {
        repository = encodeURIComponent(repository);
        try {
            const acl = (await this.call('get', `/repository/${repository}/acls`)).data;
            return Object.keys(acl)
                .filter(c => c.length && acl[c].length).sort()
                .map(c => ({
                    name: c,
                    rights: acl[c]
                }));
        } catch (e) {
            if (e === 'No ACLs') {
                return [];
            } else {
                throw e;
            }
        }
    }

    /**
    * Set ACL for a repository
    * @async
    * @param {String} repository
    * @param {String} user
    * @param {String} acl - one or many of 'a' (admin), 'r' (read) or 'w' (write)
    * @return {String} a message confirming ACL update
    */
    async setACL (repository, user, acl) {
        const data = {
            acl,
            user
        };

        repository = encodeURIComponent(repository);
        return (await this.call('post', `/repository/${repository}/acls`, data)).data.message;
    }

    /**
     * Upload an SSH key. Only RSA keys are supported.
     * @param  {String} key - key contents (NOT the path to the file)
     * @return {String} a message confirming upload
     */
    async uploadKey (key) {
        const data = {
            sshkey: key
        };

        return (await this.call('post', '/sshkeys', data)).data.message;
    }

    /**
     * Delete an SSH key
     * @param  {String} key - name of the key (usually corresponds to the key comment)
     * @return {String} a message confirming deletion
     */
    async deleteKey (key) {
        key = encodeURIComponent(key);
        return (await this.call('delete', `/sshkey/${key}`)).data.message;
    }

    /**
     * An SSH key
     * @typedef {Object} Blih~Key
     * @property {String} name - Name identifying the key (usually corresponds to the key comment)
     * @property {String} data - Actual key contents
     */

    /**
     * List all SSH keys
     * @return {Key[]} the public keys associated with your account
     */
    async listKeys () {
        const keys = (await this.call('get', '/sshkeys')).data;
        return Object.keys(keys)
            .filter(k => k.length).sort()
            .map(k => ({
                name: k,
                data: keys[k]
            }));
    }

    /**
     * Get your legacy identity
     * This is only useful for accounts created prior to 2016 that used the old login format
     * For newer users, this will simply return their email.
     * @return {String} the public keys associated with your account
     */
    async whoami () {
        return (await this.call('get', '/whoami')).data.message;
    }

    /**
     * Ping the Blih server
     * @return {Number} the response time in milliseconds
     */
    static async ping () {
        const api = axios.create(options);

        // Add timestamps to requests and responses
        api.interceptors.request.use(config => {
            config.startTimestamp = Date.now();
            return config;
        }, error => Promise.reject(error));
        api.interceptors.response.use(response => {
            response.config.endTimestamp = Date.now();
            return response;
        }, responseErrorInterceptor);

        const res = await api.get('/');
        return res.config.endTimestamp - res.config.startTimestamp;
    }

    /**
     * Make a generic call to the Blih API
     * @private
     * @param  {String} method - HTTP method to use
     * @param  {String} endpoint - remote endpoint to use
     * @param  {Object} data - request body additionnal data
     * @return {Promise} the request
     */
    async call (method, endpoint, data) {
        let body = { user: this.email, data };

        body.signature = crypto.createHmac('sha512', this.token)
            .update(body.user)
            .update(body.data ? JSON.stringify(body.data, null, 4) : '')
            .digest('hex');

        return this.api.request({
            method,
            url: endpoint,
            data: body
        });
    }

}

module.exports = Blih;
