const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')

// set mongoDB
const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true)
mongoose.Promise = global.Promise
mongoose.createConnection(
  'mongodb://localhost/mygarage',
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true
  },
  err => {
    if (err) console.error(err)
    else console.log('Connected to the mongodb')
  }
)

// init Appa
const app = express()


// set static folders
app.use(express.static('public'))

// set view engine
app.set('views', path.join(__dirname, 'views'))
app.engine(
  'handlebars',
  exphbs({
    layoutsDir: 'views',
    defaultLayout: 'home'
  })
)
app.set('view engine', 'handlebars')
app.enable('view cache')

// bodyParser
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: false
  })
)

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
)

app.use(
  expressValidator({
    errorFormatter: function (param, msg, value) {
      const namespace = param.split('.'),
        root = namespace.shift(),
        formParam = root

      while (namespace.length) {
        formParam += '[' + namespace.shift() + ']'
      }
      return {
        param: formParam,
        msg: msg,
        value: value
      }
    }
  })
)


// routes
app.use('/', require('./routes/homeRouter'))
app.use('/', require('./routes/registerRouter'))
app.use('/mygarage', require('./routes/loginRouter'))
app.use('/', require('./routes/logoutRouter'))
app.use('/addevent', require('./routes/eventRouter'))
app.use('/mygarage', require('./routes/mygarageRouter'))
app.use('/maintenance', require('./routes/maintenanceRouter'))
app.use('/addvehicle', require('./routes/vehicleRouter'))

app.use(flash())
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.user = req.user || null
  next()
})


// Set Port
app.set('port', process.env.PORT || 3000)

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'))
})
