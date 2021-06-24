var express = require('express');
var bodyParser = require('body-parser');
var routes = require('./routes.js');
var cors = require('cors');
var app = express();
var path = require('path');

var dir = path.join(__dirname, 'public');
app.use(express.static(dir));

app.use(cors());

app.use(bodyParser.json({ limit: '2mb' }));
app.use(bodyParser.urlencoded({ extended: false, limit: '2mb' }));

app.use('/', routes);

let route = 3001

app.listen(route, () => {
    console.log(`Server Ready. Listening to ${route}...`);
});
