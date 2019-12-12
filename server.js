require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');

// set mongodb
mongoose.connect(
  process.env.DATABASE_URL,
  {
    useUnifiedTopology: true,
    useNewUrlParser: true
  },
  err => {
    if (err) console.error(err);
    else console.log('connected to mongodb');
  }
);

// init express
const app = express();

// init middleware
app.use(express.static('public'));

// handlebars
app.engine('handlebars', exphbs());
app.set('view engine', 'handlebars');

// bodyParser
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: false,
    resave: false,
    cookie: {
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
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
app.use('/', require('./routes/homeRouter'));
app.use('/', require('./routes/registerRouter'));
app.use('/mygarage', require('./routes/loginRouter'));
app.use('/logout', require('./routes/logoutRouter'));
app.use('/addvehicle', require('./routes/vehicleRouter'));
app.use('/maintenance', require('./routes/maintenanceRouter'));
app.use('/mygarage', require('./routes/mygarageRouter'));
app.use('/addevent', require('./routes/eventRouter'));
const loginValidator = require('./middleware/loginValidator');
app.use(loginValidator.isLoggedIn);
app.use(loginValidator.isLoggedOut);

app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('connected to port:' + app.get('port'));
});