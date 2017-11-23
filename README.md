# Blih
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

const api = new Blih('email', 'password');

api.listRepositories()
  .then(console.log)
  .catch(console.log);

```

## Authentication

You have to be authenticated in order to use the Blih API (except for static methods), using your Epitech email and password.

**Note**: Old logins using the format 'xxxxxx_y' are not used to authenticate anymore.

## Documentation

The class exposes a set of methods, each returning a promise that will be resolved if the call was successful, rejected otherwise. In case of a failure, the response is a string describing the error.

### :cloud: Repositories

**createRepository(name, [description])**  
Create a repository.

:warning: The `description` is currently ignored.

Returns: a `String` confirming creation

**deleteRepository(name)**  
Delete a repository

Returns a `String` confirming deletion

**listRepositories()**  
Get all repositories

Returns an `Array` of `Objects` with the following properties:
```javascript
{
	// The name of the repository
	name: 'B5MEMO',

	// The URL used by the API to perform actions on this repository
	url: 'https://blih.epitech.eu/repository/B5MEMO',

	// UUID of the repository
	uuid: '6846b6e7-1ac9-5402-ba53-3cc84dd68207'
}
```

**repositoryInfo(name)**  
Get information about a repository

Returns an `Object` with the following properties:
```javascript
{
	// Description of the repository, usually always set to 'None'
	description: 'None',

	// Creation time of the repository (POSIX timestamp)
	creation_time: 1509351930,

	// The URL used by the API to perform actions on this repository
	url: 'https://blih.epitech.eu/repository/B5MEMO',

	// Visibility of the repository
	public: false,

	// UUID of the repository
	uuid: '6846b6e7-1ac9-5402-ba53-3cc84dd68207'
}
```

### :busts_in_silhouette: ACL

**setACL(name, user, acl)**  
Set ACL for a repository

Returns a `String` confirming ACL update

**getACL(name)**  
Get ACL of a repository

Returns an `Array` of `Objects` containing the following properties:
```javascript
{
	// Name of the collaborator
	name: 'ramassage-tek',

	// ACL rights given to them
	rights: 'r'
}
```

### :key: SSH keys

**uploadKey(key)**  
Upload an SSH key

Returns a `String` confirming upload

**deleteKey(key)**  
Delete an SSH key  

Returns a `String` confirming deletion

**listKeys()**  
List all SSH keys

Returns an `Array` of `Objects` containing the following properties:
```javascript
{
	// Identifier of the key
	name: 'root@pam',

	// Actual key contents
	data: 'ssh-rsa .....'
}
```

### :wrench: Miscellaneous

**whoami()**  
Get your identity

Returns a `String` containing your old login or email, depending on your promotion.

**static ping()**  
Ping the Blih server

Returns `undefined` if the server responded in time, otherwise the promise is rejected with a description of the error that caused it.
