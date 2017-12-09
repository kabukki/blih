/*
 * This is the list of every endpoint exposed by the Blih API.
 *
 * Each of them is defined by the following properties:
 * - name: name of the endpoint
 * - method: method the endpoint accepts
 * - path: path to endpoint
 *
 * Additionnally, optional properties may affect data sent or received
 * when requesting the API :
 * - data: if the endpoint accepts data
 * - transform: to transform received data
 * - onError: data to receive instead of an error, if not fatal
 */

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
            })),
        onError: _ => []
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
            .filter(c => c.rights.length).sort()
            .map(c => ({
                name: c,
                rights: data[c]
            })),
        onError: _ => []
    /*
     * SSH keys
     */
    }, {
        name: 'uploadKey',
        path: _ => '/sshkeys',
        method: 'POST',
        data: sshkey => ({ sshkey }),
        transform: data => data.message
    }, {
        name: 'deleteKey',
        path: k => `/sshkey/${k}`,
        method: 'DELETE',
        transform: data => data.message
    }, {
        name: 'listKeys',
        path: _ => '/sshkeys',
        method: 'GET',
        transform: data => Object.keys(data)
            .filter(k => k.length).sort()
            .map(k => ({
                name: k,
                data: data[k]
            })),
        onError: _ => []
    /*
     * Misc
     */
    }, {
        name: 'whoami',
        path: _ => '/whoami',
        method: 'GET'
    }
];
