const Template = require('./models/template');
const { templateSchema } = require('./schemas');
const ExpressError = require('./utils/ExpressError');

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl;
    req.flash('error', 'You must be signed in!');
    return res.redirect('/login');
  }
  next();
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const temp = await Template.findById(id);

  if (!temp.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that!');
    return res.redirect('/templates');
  }
  next();
};

module.exports.validateTemplate = (req, res, next) => {
  const { error } = templateSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(',');
    throw new ExpressError(400, msg);
  } else {
    next();
  }
};
