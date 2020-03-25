var express = require('express');
var router = express.Router();

var routeFunction = require('./config/routeFunction.js');

//Tambah require routes class disini
var simpleRoute = require('./routes/simpleRoute.js');

//Tambah use disini
router.use('/', simpleRoute);


router.get('/', (req, res) => {
    // TODO: tambah routes awal
    res.send('hi dari routes');
});

router.get('/test', (req, res) => {
});

router.get('*', routeFunction.notFoundRoute);

module.exports = router;
