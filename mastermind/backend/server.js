/* jshint strict: global, esversion: 6, devel: true, node: true */
'use strict';

const app = require('express')();
const bodyParser = require('body-parser');
const cors = require('cors');
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
app.use(cors());

const routes = require('./routes')(app);

app.listen(port, () => {
    console.log('Serwer działa na porcie 3001.');
});
