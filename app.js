if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

// IMPORTS ///////////////////////
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const ExpressError = require('./utils/ExpressError');
const methodOverride = require('method-override');
const templatesRoutes = require('./routes/templates');
const usersRoutes = require('./routes/users');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoStore = require('connect-mongo');

const app = express();

// CONNECT DATABASE /////////////////////
// const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/mess-templates';
const dbUrl = 'mongodb://localhost:27017/mess-templates';
mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

// APP CONFIG //////////////////////////
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize());

const secret = process.env.SECRET || 'notaverygoodsecret';

// Session config
const store = MongoStore.create({
  mongoUrl: dbUrl,
  secret,
  touchAfter: 24 * 60 * 60,
});

store.on('error', function (e) {
  console.log('Session store error', e);
});

const sessionConfig = {
  store,
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
};
app.use(session(sessionConfig));
app.use(flash());
app.use(helmet());

app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      'script-src': ["'self'", 'https://cdn.jsdelivr.net'],
      'font-src': [
        "'self'",
        'https://fonts.googleapis.com',
        'https://fonts.gstatic.com',
      ],
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.backUrl = req.header('Referer') || '/templates';
  res.locals.currentUser = req.user;
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', usersRoutes);
app.use('/templates', templatesRoutes);

// Home page
app.get('/', (req, res) => {
  res.render('home');
});

// Error handling
app.all('*', (req, res, next) => {
  next(new ExpressError(404, 'Page Not Found'));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = 'Something Went Wrong!';
  res.status(statusCode).render('error', { err });
});

// Start serving
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`SERVING ON PORT ${port}`);
});
