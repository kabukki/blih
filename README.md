# Blih
Blih API for Node using the Promise API.

## Installation

Using npm:
```
npm install blih
```

## Examples

Get all your repositories :

```javascript
const Blih = require('blih');

const api = new Blih('email', 'password');

api.listRepositories()
  .then(data => { console.log(data); })
  .catch(err => { console.log(err); });

```

## Authentication

You have to be authenticated in order to use the Blih API, using your Epitech email and password.

__Note__: Old logins using the format 'xxxxxx_y' are not used to authenticate anymore.

## Documentation

Successful calls resolve the promise, while failed calls reject it.

### Success

The response for a successful call is an object containing directly all the data provided by the server.

Api call            | Description                         | Arguments         | Response properties
--------------------|-------------------------------------|-------------------|--------------------------
createRepository    | create a repository                 | name, description | message
listRepositories    | get all repositories                | -                 | message, repositories
deleteRepositories  | delete a repository                 | name              | message
repositoryInfo      | get information about a repository  | name              | message
setACL              | set ACL for a repository            | name, user, acl   | message
getACL              | get ACL of a repository             | name              | _all collaborators_
uploadKey           | upload an ssh key                   | sshkey            | message
deleteKey           | delete an ssh key                   | sshkey            | message
listKeys            | list all ssh keys                   | -                 | _all keys_
whoami              | get identity                        | -                 | message
ping                | ping the server                     | -                 | 'Bocal Lightweight Interface for Humans'

:warning: the 'description' argument provided to `createRepository` is ignored.

:warning: the 'message' property in response to `repositoryInfo` contains directly the data

### Failure

The response for an unsuccessful call is an object containing the following information :
```javascript
{
  // 'status' is the HTTP status code from the server response
  status: 401,
  
  // 'statusText' is the HTTP status message from the server response
  statusText: 'Unauthorized',
  
  // 'data' is the response that was provided by the server
  data: {
    error: 'Bad token'
  }
}
```
