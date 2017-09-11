const jwt = require('jsonwebtoken');
const assert = require('assert');

module.exports = exports = function (req, res) {
    assert(req.headers, 'Your request must have headers.');
    assert(req.headers.authorization, 'Your request must contain an Authorization header.');

    console.log('farts');
}