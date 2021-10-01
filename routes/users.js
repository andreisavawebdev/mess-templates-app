const express = require('express');
const router = express.Router();
const users = require('../controllers/users');
const passport = require('passport');

router.route('/register').get(users.showRegisterForm).post(users.registerUser);

router
  .route('/login')
  .get(users.showLoginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    users.loginUser
  );

router.get('/logout', users.logoutUser);

module.exports = router;
