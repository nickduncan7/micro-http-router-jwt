const micro = require('micro');
const Router = require('micro-http-router');
const { setupJWT, verifyToken } = require('../');

// Initialize the router
const router = new Router();

// Initialize the JWT middleware
setupJWT({ secret: 'super secret' });

// Define our protected route handler
router.get('/', verifyToken, (req, res) => {
    return `Hello, ${ req.token.firstname } ${ req.token.lastname }`;
});

// Start micro and listen
const server = micro((req, res) => router.handle(req, res));
const port = 3000;
server.listen(port);
console.log(`micro is listening on port: ${ port }`);