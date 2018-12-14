module.exports.test = () => ({
    handler: './src/index.handle',
    events: [
        {
            http: {
                path: "/test/", method: 'GET'
            }
        }
    ]
});