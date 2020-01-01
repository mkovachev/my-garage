if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}

const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

const authGuard = require('../middleware/authGuard')

const app = express();

const events = require('./routes/events')
const home = require('./routes/home')
const maintenance = require('./routes/maintenance')
const users = require('./routes/users')
const vehicles = require('./routes/vehicles')

// set view engine
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

// set mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

// Express Session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true, // don't create session until something stored
    resave: false, // don't save session if unmodified
    cookie: {
      maxAge: 3600000 // one hour expiration
    }
  })
);

app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      const namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root;

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']';
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      };
    }
  })
);

app.use(flash());
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.user = req.user || null;
  next();
});

app.use(authGuard)
app.use('/', home)
app.use('/users', users)
app.use('/events', events)
app.use('/maintenance', maintenance)
app.use('/vehicles', vehicles)

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});