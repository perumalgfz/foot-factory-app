const User = require("../models/user.model.js");
var jwt = require('jsonwebtoken');

const hash = require('../helper/hash_pw');
const validate = require('../helper/validate_pw');

exports.findAll = (req, res) => {
  User.getAll((err, data) => {
    if (err)
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving users."
      });
    else res.send(data);
  });
};

//   Create and Save a new User:
exports.create = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  hash(req.body.password, (err, hash) => {

    // Create a User
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hash,
      role: req.body.role,
      
      address: req.body.address,
      pincode: req.body.pincode,
      phoneNo: req.body.phoneNo,
      profile: req.body.profile,

      status: req.body.status
    });

    // Save User in the database
    User.create(user, (err, data) => {
      if (err) {
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the User."
        });
      } else {
        if (data.reg_status == 'exists') {
          return res.status(400).json({ "error": "This user 'email id' already exists" })
        }
        // jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: process.env.JWT_EXPIRES_IN });
        var token = jwt.sign(data, 'wo+~PPEy&Kdc[Zw', { expiresIn: '1h' });
        console.log(data.affectedRows)
        res.json({ "status": "created" })
      }
    });

  });

};

// Find a user with a userId
exports.findOne = (req, res) => {
  User.findById(req.params.id, (err, data) => {
    if (err) {
      if (err.kind === "not_found") {
        return res.status(404).send({
          message: `Not found User id.`
        });
      } else {
        return res.status(500).send({
          message: "Error retrieving User id "
        });
      }
    } else res.send(data);
  });
};

exports.update = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }
  const now = new Date().toISOString();
  const currnetDate = now.slice(0, 19).replace('T', ' ');

  var updated_at = {
    updated_at: currnetDate
  }

  var userUpdate = Object.assign(req.body, updated_at);
  User.updateById(req.params.id, (userUpdate), (err, data) => {

    if (err) {
      if (err.kind === "not_found") {
        res.send({
          message: 'Record not found'
        });
      } else if (err.kind === "MYQSLError") {
        return res.status(405).send({
          message: 'Unknown value'
        });
      } else {
        return res.status(500).send({
          message: "Error updating user id "
        });
      }
    } else res.send(data);
  }
  );
};


exports.login = (req, res, next) => {

  if (!req.body.email || !req.body.password) {
    res.status(400).json({ "error": "bad request" })
    return
  }

  User.loginCheck(req.body, (err, data) => {

    if (err) {
      if (err.kind === "Unauthorized") {
        res.status(401).json({ "error": "Unauthorized" })
        return
      }

      if (err.kind === "account_inactive") {
        res.status(401).json({ "message": "Your account is inactive" })
        return
      }

    } else {
      console.log(data)
      var token = jwt.sign(data, 'wo+~PPEy&Kdc[Zw', { expiresIn: '1h' });
      res.json({ "status": "Login Success", "token": token });
    }
  });
};

exports.updatePwd = (req, res) => {
  // Validate Request
  if (!req.body) {
    return res.status(400).send({
      message: "Content can not be empty!"
    });
  }

  if (!req.body.old_password || !req.body.new_password || !req.body.confirm_password) {
    res.status(400).json({ "error": "bad request" })
    return
  }

  hash(req.body.new_password, (err, hash) => {

    const now = new Date().toISOString();
    const currnetDate = now.slice(0, 19).replace('T', ' ');

    var updated_at = {
      id: req.user.id,
      email: req.user.email,
      update_pwd: hash,
      updated_at: currnetDate
    }

    var pwdUpdate = Object.assign(req.body, updated_at);

    User.pwdCheck(pwdUpdate, (err, data) => {

      if (err) {
        if (err.kind === "IncorrectPwd") {
          res.status(401).json({ "error": "Incorrect Password..." })
          return
        }

        if (err.kind === "Unauthorized") {
          res.status(401).json({ "error": "Unauthorized.." })
          return
        }

        if (err.kind === "account_inactive") {
          res.status(401).json({ "message": "Your account is inactive" })
          return
        }

      } else {
        console.log(data)
        if (data.kind == "confirmPwdWrong") {
          res.status(401).json({ "message": "Did not match confirm password" })
          return
        }
        if (data.kind == "pwdCrt") {
          res.json({ "status": "Password Updated" })
          return
        }
      }
    });
  });

};

//DELETE User By id
exports.delete = (req, res) => {
  if (Number.isNaN(Number(req.params.id))) {
      return res.send({
          message: 'This is NOT a number'
      });
  }

  User.remove(req.params.id, (err) => {
      if (err) {
          if (err.kind === "not_found") {
              return res.status(404).send({
                  message: `Not found ${req.params.id}.`
              });
          } else {
              return res.status(500).send({
                  message: "Could not delete User " + req.params.id
              });
          }
      } else res.send({ message: `ID: ${req.params.id} User Account was deleted successfully! ` });
  });
};
