# Blih

[![npm](https://img.shields.io/npm/v/blih.svg?style=flat-square)](https://www.npmjs.com/package/blih)
[![npm](https://img.shields.io/npm/dt/blih.svg?style=flat-square)](https://www.npmjs.com/package/blih)

Blih API for Node using the Promise API.

## Installation

Using npm:
```bash
$ npm install blih
```

## Quickstart

Get all your repositories :

```javascript
const Blih = require('blih');

const api = new Blih({ email: 'email', password: 'password' });

api.listRepositories()
  .then(console.log)
  .catch(console.log);

```

## Authentication

You have to be authenticated in order to use the Blih API (except for static methods), using your Epitech email and password.

```javascript
const api = new Blih({ email: 'email', password: 'password' });
```

**Note**: Old logins using the format 'xxxxxx_y' are not used to authenticate anymore.

Alternatively, you can pass your token instead of your password if you have it. If both are given, only the token is taken into account.

```javascript
const api = new Blih({ email: 'email', token: 'token' });
```

## Documentation

Find the documentation [here](https://kabukki.github.io/blih).
