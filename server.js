if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

const express = require('express')
const bodyParser = require('body-parser')
const exphbs = require('express-handlebars')
const session = require('express-session')
const flash = require('connect-flash')
const methodOverride = require('method-override')

const app = express();

const passport = require('passport')
const initializePassport = require('./middleware/passport-config')
initializePassport(
  passport,
  email => users.find(user => user.email === email),
  id => users.find(user => user.id === id)
)

// set view engine
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.static('public'))

app.use(bodyParser.urlencoded({ limit: '10mb', extended: false })) // req.body

app.use(session({
  cookie: { maxAge: 60000 },
  secret: process.env.SESSION_SECRET,
  resave: false, // don't save if no changes
  saveUninitialized: false // don't save empty value in the session
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))
app.use(flash())

// set mongoDB
const mongoose = require('mongoose')
mongoose.connect(process.env.DATABASE_URL,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to mongoDB'))

const events = require('./routes/events')
const home = require('./routes/home')
const maintenance = require('./routes/maintenance')
const users = require('./routes/users')
const vehicles = require('./routes/vehicles')
app.use('/', home)
app.use(['/', '/mygarage'], users)
app.use('/addevent', events)
app.use('/addvehicle', vehicles)
app.use('/maintenance', maintenance)

app.set('port', process.env.PORT || 3000);

app.listen(app.get('port'), function () {
  console.log('Server started on port ' + app.get('port'));
});