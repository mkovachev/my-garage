const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const exphbs = require('express-handlebars');
const session = require('express-session');
const flash = require('connect-flash');

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
app.use(bodyParser.urlencoded({ extended: false }));

// session
app.use(
  session({
    secret: 'secret',
    saveUninitialized: true,
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
const homeRouter = require('./routes/homeRouter');
const vehicleRouter = require('./routes/vehicleRouter');
const logoutRouter = require('./routes/logoutRouter');
const loginRouter = require('./routes/loginRouter');
const registerRouter = require('./routes/registerRouter');
const eventRouter = require('./routes/eventRouter');
const maintenanceRouter = require('./routes/maintenanceRouter');
const mygarageRouter = require('./routes/mygarageRouter');
const loginValidator = require('./middleware/loginValidator');
app.use('/', homeRouter);
app.use('/', registerRouter);
app.use('/mygarage', loginRouter);
app.use('/logout', logoutRouter);
app.use('/addvehicle', vehicleRouter);
app.use('/maintenance', maintenanceRouter);
app.use('/mygarage', mygarageRouter);
app.use('/addevent', eventRouter);
app.use(loginValidator.isLoggedIn);
app.use(loginValidator.isLoggedOut);


app.set('port', process.env.PORT || 3000);
app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});