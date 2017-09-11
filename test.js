const { test } = require('ava');
const micro = require('micro');
const listen = require('test-listen');
const request = require('request-promise');
const Router = require('micro-http-router');
const { setupJWT, verifyToken } = require('./');

// Initialize the JWT middleware
setupJWT({ secret: 'super secret' });

test('simple request handled successfully', async t => {
    // Create new instance of micro-http-router
    const router = new Router();

    // Configure the routes
    router.get('/', verifyToken, (req, res) => {
        micro.send(res, 200, `${ req.token.firstname } ${ req.token.lastname }`);
    });

    // Create the service
    const service = micro((req, res) => router.handle(req, res));

    // Listen to the service and make the request to route '/'
    const url = await listen(service);

    const requestOptions = {
        method: 'GET',
        uri: url,
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJKb2huIiwibGFzdG5hbWUiOiJEb2UifQ.uJyAj8F-CDk7gsmnOKi8jkslaSVQOrM9at2RBEY8-lo'
        }
    };

    const response = await request(requestOptions);

    // Perform the test check
    t.deepEqual(response, 'John Doe');

    // Close the service
    service.close();
});


test('lack of authorization header => error 401', async t => {
    // Create new instance of micro-http-router
    const router = new Router();

    // Configure the routes
    router.get('/', verifyToken, (req, res) => {
        micro.send(res, 200, `${ req.token.firstname } ${ req.token.lastname }`);
    });

    // Create the service
    const service = micro((req, res) => router.handle(req, res));

    // Listen to the service and make the request to route '/'
    const url = await listen(service);

    const requestOptions = {
        method: 'GET',
        uri: url
    };

    try {
        const response = await request(requestOptions);
        
        // An error is expected, fail if it does not throw
        t.fail();
    } catch (e) {
        if (e.statusCode === 401) {
            t.pass();
        } else {
            t.fail();
        }
    }

    // Close the service
    service.close();
});

test('invalid JWT => error 401', async t => {
    // Create new instance of micro-http-router
    const router = new Router();

    // Configure the routes
    router.get('/', verifyToken, (req, res) => {
        micro.send(res, 200, `${ req.token.firstname } ${ req.token.lastname }`);
    });

    // Create the service
    const service = micro((req, res) => router.handle(req, res));

    // Listen to the service and make the request to route '/'
    const url = await listen(service);

    const requestOptions = {
        method: 'GET',
        uri: url,
        headers: {
            'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJKb2huIiwibGFzdG5hbWUiOiJEb2UifQ.JDMcWZ9mc7f_NHfBU8lyOBgeJgLuWnyOzPT860g9aWM'
        }
    };

    try {
        const response = await request(requestOptions);
        
        // An error is expected, fail if it does not throw
        t.fail();
    } catch (e) {
        if (e.statusCode === 401) {
            t.pass();
        } else {
            t.fail();
        }
    }

    // Close the service
    service.close();
});

test('invalid authorization header => error 401', async t => {
    // Create new instance of micro-http-router
    const router = new Router();

    // Configure the routes
    router.get('/', verifyToken, (req, res) => {
        micro.send(res, 200, `${ req.token.firstname } ${ req.token.lastname }`);
    });

    // Create the service
    const service = micro((req, res) => router.handle(req, res));

    // Listen to the service and make the request to route '/'
    const url = await listen(service);

    const requestOptions = {
        method: 'GET',
        uri: url,
        headers: {
            'Authorization': 'BadTokenHere'
        }
    };

    try {
        const response = await request(requestOptions);
        
        // An error is expected, fail if it does not throw
        t.fail();
    } catch (e) {
        if (e.statusCode === 401) {
            t.pass();
        } else {
            t.fail();
        }
    }

    // Close the service
    service.close();
});
