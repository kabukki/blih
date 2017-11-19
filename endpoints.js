module.exports = [
    {
        name: 'createRepository',
        method: 'POST',
        path: _ => '/repositories',
        data: (name, description) => ({ name, type: 'git', description: undefined })
    }, {
        name: 'listRepositories',
        method: 'GET',
        path: _ => '/repositories'
    }, {
        name: 'deleteRepository',
        method: 'DELETE',
        path: r => `/repository/${r}`
    }, {
        name: 'repositoryInfo',
        method: 'GET',
        path: r => `/repository/${r}`
    }, {
        name: 'setACL',
        method: 'POST',
        args: ['acl', 'user'],
        path: r => `/repository/${r}/acls`,
        data: (repository, user, acl) => ({ acl, user })
    }, {
        name: 'getACL',
        path: r => `/repository/${r}/acls`,
        method: 'GET'
    }, {
        name: 'uploadKey',
        path: _ => '/sshkeys',
        method: 'POST',
        data: (sshkey) => ({ sshkey })
    }, {
        name: 'deleteKey',
        path: k => `/sshkey/${k}`,
        method: 'DELETE'
    }, {
        name: 'listKeys',
        path: _ => '/sshkeys',
        method: 'GET'
    }, {
        name: 'whoami',
        path: _ => '/whoami',
        method: 'GET'
    }
];
