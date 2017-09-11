# micro-http-router-jwt
JWT handler for use with [micro-http-router](https://github.com/protocol114/micro-http-router). Currently only supports tokens in the Authorization header. Tokens must be supplied in the form:

```
Authorization: Bearer <your JSON web token>
```

## Usage
An example Micro server using `micro-http-router` and `micro-http-router-jwt`:
```javascript
const micro = require('micro');
const Router = require('micro-http-router');
const { setupJWT, verifyToken } = require('micro-http-router-jwt');

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
```

Using the following Authorization header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmaXJzdG5hbWUiOiJKb2huIiwibGFzdG5hbWUiOiJEb2UifQ.uJyAj8F-CDk7gsmnOKi8jkslaSVQOrM9at2RBEY8-lo
```

You will receive the response `Hello, John Doe`. All claims will be available on `req.token`, this example simply has a first name and last name in the JWT claims.

## License
MIT License

Copyright (c) 2017 Nick Duncan

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.