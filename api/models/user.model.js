const sql = require("./db.js");
const validate = require('../helper/validate_pw');
var jwt = require('jsonwebtoken');

var now = new Date().toISOString();
var currnetDate = now.slice(0, 19).replace('T', ' ');

// constructor User
const User = function (user) {
  this.name = user.name;
  this.email = user.email;
  this.password = user.password;
  // this.token = user.token;
  this.role = 'customer';
  this.address = user.address;
  this.pincode = user.pincode;
  this.phoneNo = user.phoneNo;
  this.profile = user.profile;
  this.status = user.status;
  this.created_at = currnetDate;
  this.updated_at = currnetDate;
};

User.create = (newUser, result) => {

  sql.query(`SELECT * FROM users WHERE email = ?`, [newUser.email], (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("This user email id already exists: ", res[0].id + ' , ' + res[0].email);
      result(null, { reg_status: 'exists' });
      return;
    } else {

      sql.query("INSERT INTO users SET ?", newUser, (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(err, null);
          return;
        }

        console.log("User created: ", { id: res.insertId, ...newUser });
        result(null, { customerid: res.insertId, customerEmail: res.email });
      });

    }
  });
};

User.findById = (userId, result) => {
  sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("found User: ", res[0]);
      result(null, res[0]);
      return;
    }

    // not found User with the id
    result({ kind: "not_found" }, null);
  });
}

User.getAll = result => {
  sql.query("SELECT * FROM users", (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("Users: ", res);
    result(null, res);
  });
}

User.updateById = (id, user, result) => {

  var fields = "";
  Object.keys(user).forEach(key => {
    fields = fields.concat(`${key} =  '${user[key]}',`);
  });

  fields = fields.slice(0, -1);

  var query = `UPDATE users SET ${fields} WHERE id = ${id}`;

  sql.query(query, (err, res) => {
    if (err) {
      result({ kind: "MYQSLError" }, null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("updated User: ", { id: id, ...user });
    result(null, { id: id, ...user });
  });
}

User.remove = (id, result) => {
  sql.query("DELETE FROM users WHERE id = ?", id, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    if (res.affectedRows == 0) {
      // not found User with the id
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("deleted User with id: ", id);
    result(null, res);
  });
}

User.loginCheck = (userData, result) => {

  sql.query("SELECT * FROM `users` WHERE email = ? LIMIT 1", userData.email,
    (error, results, fields) => {
      if (error) {
        console.log("error: ", error);
        result(null, error);
        return;
      };
      // check if user exists
      if (!results || !results[0]) {
        console.log("No user")
        result({ kind: "Unauthorized" }, null);
        return
      }

      // check if user active/not
      if (results[0].status == '0') {
        result({ kind: "account_inactive" }, null);
        return
      }

      // validate password
      validate(userData.password, results[0].password, (err, valid) => {
        if (err) {
          console.log(err)
          result({ kind: "Unauthorized" }, null);
          return
        }
        if (valid) {
          console.log("Login Success: ", { id: results[0].id, ...userData });
          var now = new Date().toISOString();
          var currnetDate = now.slice(0, 19).replace('T', ' ');
          //  UPDATE NEW login time
          sql.query(`UPDATE users SET lastLogin_at = ? WHERE email = ?`, [currnetDate, userData.email], (err, res) => {

            if (res.affectedRows == 0) {
              result({ kind: "not_found" }, null);
              return;
            }

          });

          result(null, { id: results[0].id, name: results[0].name, email: results[0].email });
          return
        } else {
          result({ kind: "Unauthorized" }, null);
          return
        }
      })
    }
  );
}

User.pwdCheck = (pwdData, result) => {

  sql.query(
    "SELECT * FROM `users` WHERE email = ? LIMIT 1", pwdData.email,
    (error, results, fields) => {
      if (error) {
        console.log("error: ", error);
        result(null, error);
        return;
      };

      // check if user exists
      if (!results || !results[0]) {
        console.log("No user")
        result({ kind: "Unauthorized" }, null);
        return
      }

      // check if user active/not
      if (results[0].status == '0') {
        result({ kind: "account_inactive" }, null);
        return
      }

      // validate password
      validate(pwdData.old_password, results[0].password, (err, valid) => {
        if (err) {
          console.log(err)
          result({ kind: "IncorrectPwd" }, null);
          return
        }

        if (valid) {

          if (pwdData.new_password == pwdData.confirm_password) {

            //  UPDATE NEW PASSWORD
            sql.query(`UPDATE users SET password = ?, updated_at = ? WHERE id = ?`, [pwdData.update_pwd, pwdData.updated_at, pwdData.id], (err, res) => {
              if (err) {
                result({ kind: "MYQSLError" }, null, err);
                return;
              }

              if (res.affectedRows == 0) {
                result({ kind: "not_found" }, null);
                return;
              }

              result(null, { kind: "pwdCrt" });
              return
            });

          } else {
            console.log('Please check Confirm password is wrong....')
            result(null, { kind: "confirmPwdWrong" });
            return
          }

        } else {
          result({ kind: "IncorrectPwd" }, null);
          return
        }
      })
    });
}


module.exports = User;