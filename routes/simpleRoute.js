var express = require('express');
var router = express.Router();

var routeFunction = require('../config/routeFunction.js');

var simpleController = require('../controllers/simpleController.js');

router.post('/update/save', simpleController.saveUpdate);
router.post('/updates', simpleController.updates);
router.post('/join', simpleController.join);
router.post('/goodpeople', simpleController.goodpeople);

router.all('*', routeFunction.notFoundRoute);

module.exports = router;
