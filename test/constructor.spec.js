/* eslint-env mocha */

const assert = require('assert');
const Blih = require('..');
const crypto = require('crypto');

const [email, password, token] = ['email', 'password', 'token'];
const endpoints = ['createRepository', 'deleteRepository', 'listRepositories', 'repositoryInfo', 'getACL', 'setACL', 'uploadKey', 'deleteKey', 'listKeys', 'whoami'];

describe('Constructor', function () {

    describe('parameters', function () {

        it('should throw with no parameter', function () {
            assert.throws(_ => {
                new Blih();
            }, /Missing credentials/);
        });

        it('should throw when email not provided', function () {
            assert.throws(_ => {
                new Blih({});
                new Blih({ email: undefined });
                new Blih({ email: '' });
            }, /Email is mandatory to authenticate/);
        });

        it('should throw when password/token not provided', function () {
            assert.throws(_ => {
                new Blih({ email });
                new Blih({ email, password: undefined });
                new Blih({ email, password: '' });
                new Blih({ email, token: undefined });
                new Blih({ email, token: '' });
            }, /A password or token is needed to authenticate/);
        });

        it('should not throw when credentials provided', function () {
            assert.doesNotThrow(_ => {
                new Blih({ email, password });
                new Blih({ email, token });
                new Blih({ email, password, token });
            });
        });

    });

    describe('token', function () {

        it('should match', function () {
            const expected = crypto.createHash('sha512').update(password).digest('hex');
            const actual = new Blih({ email, password }).token;
            assert.equal(actual, expected, 'Tokens differ');
        });

        it('should not match', function () {
            const expected = crypto.createHash('sha512').update('not match').digest('hex');
            const actual = new Blih({ email, password }).token;
            assert.notEqual(actual, expected, 'Tokens match');
        });

    });

    describe('endpoints', function () {

        it('should exist', function () {
            const api = new Blih({ email, password });
            for (const endpoint of endpoints) {
                assert.ok(api[endpoint], 'Endpoint ' + endpoint + ' does not exist');
                assert.equal(typeof api[endpoint], 'function', 'Endpoint is not a function');
            }
        });

        it('should include static ping', function () {
            assert.ok(Blih['ping'], 'Static ping endpoint does not exist');
            assert.equal(typeof Blih['ping'], 'function', 'Static ping endpoint is not a function');
        });

    });

});
