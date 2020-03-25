var queryFunction = require('./queryFunction.js');

exports.notFoundRoute = (req, res) => {
    let results = {
        result: false,
        msg: 'Invalid Route.'
    }
    res.send(results);
};
