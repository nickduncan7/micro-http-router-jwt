const jwt = require('jsonwebtoken');
const assert = require('assert');
const micro = require('micro');

const _options = {};

const moduleMethods = {
    /**
     * Sets up the JWT handler.
     * @param {Object} options The options object.
     */
    setupJWT: function (options) {
        assert(options, 'You must provide a valid options object.');
        assert(options.secret, 'You must provide a valid secret.');

        _options.secret = options.secret;
        _options.debug = options && options.debug;

        if (options.headerSchema) {
            _options.headerSchema = options.headerSchema;
        } else {
            _options.headerSchema = 'Bearer';
        }
    },

    /**
     * Verifies the token on the request.
     * @param {*} req 
     * @param {*} res 
     */
    verifyToken: function (req, res) {
        try {
            assert(req.headers, 'Your request must have headers.');
            assert(req.headers.authorization, 'Your request must contain an Authorization header.');
        
            const headerParts = req.headers.authorization.split(' ');

            if (headerParts.length !== 2 || headerParts[0] !== _options.headerSchema) {
                micro.send(res, 401);
            }

            const token = jwt.verify(headerParts[1], _options.secret);
            if (token) req.token = token;
        } catch (e) {
            if (_options.debug) console.log(e);
            micro.send(res, 401, _options.debug ? e.message : null);
        }
    }
}

module.exports = moduleMethods;