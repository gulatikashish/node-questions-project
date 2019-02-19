const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


const favicon = require('static-favicon'); // to serve public files
const logger = require('morgan'); // for logger
const cors = require('cors');

const users = require('./routes/authRoute');
const config = require('./config');
const db = require('./db');
const port = config.port;
const app = express();

app.use(cors());
db.connect();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.render('index', (err, res) => [
  console.log(err, res, "==-=-=-=")
])

app.use('/', users)

app.listen(port, (err, data) => {
  if (err) {
    throw err;
  } else {
    console.log(`----- SERVER STARTED AT ${port} -----`);
  }
});
module.exports = app;
