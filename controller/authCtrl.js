const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator/check');
const { encrypt, decrypt } = require('../common/services');
const { findOneByEmail, findOneById, insert, validEmailPassword, updatePassword } = require('../models/userDbService');
const config = require('../config');

const getProfile = async (req, res) => {
  try {
    const { _id } = req.body;
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    const user = await findOneById(_id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'NO Such Id Exist',
      });
    }
    return res.status(200).send({
      success: true,
      message: 'User Data',
      data: user,
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message,
    });
  }
};
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    let { name, email, password } = req.body;
    let check = await findOneByEmail(email);
    if (check) {
      res.status(409).send({
        success: false,
        message: 'Email Already Exist',
      });
      return;
    }
    let encpassword = encrypt(password);
    let user = await insert(name, email, encpassword);
    res.status(201).send({
      success: true,
      message: 'Registration Success',
      data: user,
    });
  } catch (error) {
    res.status(501).send({
      success: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    let { email, password } = req.body;
    let check = await findOneByEmail(email);
    if (!check) {
      res.status(401).send({
        success: false,
        message: 'No Such Email Exist',
      });
      return;
    }
    let encPassword = await decrypt(password, check.password);
    if (!encPassword) {
      res.status(401).send({
        success: false,
        message: 'Invalid Credentials',
      });
    }
    let token = jwt.sign(
      {
        _id: check._id,
        email: check.email,
      },
      config.secret,
      { expiresIn: config.tokenExpiresInMinutes * 1000 * 60 },
    );
    res.status(200).send({
      success: true,
      message: 'Login Success',
      data: check,
      token: token,
    });
    return;
  } catch (error) {
    res.status(401).send({
      success: false,
      message: 'error',
    });
    return;
  }
};
const changePassword = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.mapped() });
    }
    let { _id, oldPassword, newPassword } = req.body;
    let user = await findOneById(_id);
    if (!user) {
      return res.status(401).send({
        success: false,
        message: 'No Such Id Exist',
      });
    }
    let checkPassword = await decrypt(oldPassword, user.password);
    if (checkPassword) {
      let encpassword = encrypt(newPassword);
      await updatePassword(_id, encpassword);
      res.status(200).send({
        success: true,
        message: 'Password Upadted',
      });
      return;
    } else {
      res.status(401).send({
        success: false,
        message: 'Incorrect Password',
      });
    }
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getProfile,
  login,
  register,
  changePassword,
};
