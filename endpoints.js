module.exports = [
    /*
     * Repositories
     */
    {
        name: 'createRepository',
        method: 'POST',
        path: _ => '/repositories',
        data: (name, description) => ({ name, type: 'git', description: undefined })
    }, {
        name: 'deleteRepository',
        method: 'DELETE',
        path: r => `/repository/${r}`
    }, {
        name: 'listRepositories',
        method: 'GET',
        path: _ => '/repositories',
        transform: data => Object.keys(data.repositories)
            .filter(r => r.length).sort()
            .map(r => ({
                name: r,
                url: data.repositories[r].url,
                uuid: data.repositories[r].uuid
            }))
    }, {
        name: 'repositoryInfo',
        method: 'GET',
        path: r => `/repository/${r}`,
        transform: data => {
            data.message.public = data.message.public !== 'False';
            return data.message;
        }
    /*
     * ACL
     */
    }, {
        name: 'setACL',
        method: 'POST',
        args: ['acl', 'user'],
        path: r => `/repository/${r}/acls`,
        data: (repository, user, acl) => ({ acl, user })
    }, {
        name: 'getACL',
        path: r => `/repository/${r}/acls`,
        method: 'GET',
        transform: data => Object.keys(data)
            .filter(c => c.length).sort()
            .map(c => ({
                name: c,
                rights: data[c]
            }))
    /*
     * SSH keys
     */
    }, {
        name: 'uploadKey',
        path: _ => '/sshkeys',
        method: 'POST',
        data: sshkey => ({ sshkey })
    }, {
        name: 'deleteKey',
        path: k => `/sshkey/${k}`,
        method: 'DELETE'
    }, {
        name: 'listKeys',
        path: _ => '/sshkeys',
        method: 'GET',
        transform: data => Object.keys(data)
            .filter(k => k.length).sort()
            .map(k => ({
                name: k,
                data: data[k]
            }))
    /*
     * Misc
     */
    }, {
        name: 'whoami',
        path: _ => '/whoami',
        method: 'GET'
    }
];
