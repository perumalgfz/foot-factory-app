const express = require('express')
const app = express()

const cors = require('cors')
const cookieSession = require('cookie-session');
const bodyParser = require('body-parser');
require('dotenv').config()

// parse application/json
app.use(bodyParser.json());
app.use(cors());

require('./api/routes/user.routes')(app);
require('./api/routes/food.routes')(app);
require('./api/routes/ingredient.routes')(app);
require('./api/routes/order.routes')(app);

// For an actual app you should configure this with an experation time, better keys, proxy and secure
app.use(cookieSession({
  name: 'tuto-session',
  keys: ['key1', 'key2']
}))

app.set('view engine', 'ejs');

app.all('*', (req, res, next) => {
  res.status(404).json({
    status: 'fail',
    message: `Can't find ${req.originalUrl} on this server!`
  });
});

app.get('/logout', (req, res) => {
  req.session = null;
  req.logout();
  res.redirect('/');
});

app.get('*', function (req, res, next) {
  res.status(301).redirect('/not-found');
});

app.use((error, req, res, next) => {

  if (!error.statusCode) error.statusCode = 500;
  if (!error.statusCode) error.statusCode = 502;
  if (error.statusCode === 502) {
    return res.status(502).redirect('/not-found');
  }
  if (error.statusCode === 301) {
    return res.status(301).redirect('/not-found');
  }

  return res
    .status(error.statusCode)
    .json({ error: error.toString() });
});

app.listen(8080, () => console.log(`Example app listening on port ${8080}!`))
