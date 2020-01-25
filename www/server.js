const express = require('express');
var bodyParser = require("body-parser");
const app = express();
const cors = require('cors');
const debug = require('debug')('sso:main');

require('dotenv').config();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

require('../clients/database.js');

app.use(require('../api/router.js')(express));

debug(`Booting up...`);

app.listen(process.env.APP_PORT || 4000, () => console.log(`Server levantado en puerto ${process.env.APP_PORT || 4000}`))
