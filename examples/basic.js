const micro = require('micro');
const Router = require('micro-http-router');
const jwt = require('../');

// Initialize the router
const router = new Router();

// or define it with your get shorthand
router.get('/', jwt, (req, res) => {
    return 'Hello';
});

// Start micro and listen
const server = micro((req, res) => router.handle(req, res));
const port = 3000;
server.listen(port);
console.log(`micro is listening on port: ${ port }`);