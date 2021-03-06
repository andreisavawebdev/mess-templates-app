const User = require('../models/user');
const catchAsync = require('../utils/catchAsync');

module.exports.showRegisterForm = (req, res) => {
  res.render('users/register');
};

module.exports.registerUser = catchAsync(async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash('success', 'Account created!');
      res.redirect('/templates');
    });
  } catch (error) {
    req.flash('error', error.message);
    res.redirect('/register');
  }
});

module.exports.showLoginForm = (req, res) => {
  res.render('users/login');
};

module.exports.loginUser = (req, res) => {
  req.flash('success', 'Welcome back!');
  const redirectUrl = req.session.returnTo || '/templates';
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

module.exports.logoutUser = (req, res) => {
  req.logout();
  req.flash('success', 'Goodbye!');
  res.redirect('/');
};
