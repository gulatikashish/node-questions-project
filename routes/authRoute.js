const express = require('express');
const { check, validationResult } = require('express-validator/check');
const { matchedData, sanitize } = require('express-validator/filter');
const app = express();
const { register, login, changePassword, getProfile,getdata } = require('../controller/authCtrl');

app.post('/profile', [check('_id').exists()], getProfile);

app.post(
  '/register',
  [
    check('email')
      .isEmail()
      .withMessage('must be an email'),
    check('name').exists(),
    check('password').exists(),
  ],
  register,
);
app.post(
  '/login',
  [
    check('email')
      .isEmail()
      .withMessage('must be an email'),
    check('password').exists(),
  ],
  login,
);
app.put(
  '/changePassword',
  [check('_id').exists(), check('oldPassword').exists(), check('newPassword').exists()],
  changePassword,
);

module.exports = app;
