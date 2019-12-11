const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');
const logger = require('./middleware/logger.js');

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.Promise = global.Promise;
mongoose.connect(
  'mongodb://localhost/mygarage',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (err) console.error(err);
    else console.log('Connected to mongodb');
  }
);

// init App
const app = express();

// init middleware
//app.use(logger);
app.use(express.static('public'));

// set view engine
app.set('views', path.join(__dirname, 'views'));
app.engine(
  'handlebars',
  exphbs({
    layoutsDir: 'views',
    defaultLayout: 'home'
  })
);
app.set('view engine', 'handlebars');
app.enable('view cache');

// bodyParser
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

// session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true, // create session when sth is stored
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

// routes
const homeRouter = require('./routes/homeRouter');
const vehicleRouter = require('./routes/vehicleRouter');
const logoutRouter = require('./routes/logoutRouter');
const loginRouter = require('./routes/loginRouter');
const loginValidator = require('./middleware/loginValidator');
app.use('/', homeRouter);
app.use('/', vehicleRouter);
app.use('/', logoutRouter);
app.use('/', loginRouter);
app.use(loginValidator.isLoggedIn);
app.use(loginValidator.isLoggedOut);

// Set Port
app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});