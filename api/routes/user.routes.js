module.exports = app => {
  const user = require("../controllers/user.controller.js");
  const { checkToken } = require("../models/token_validation");

  app.post("/login", user.login);

  // Create a new User
  app.post("/user", user.create);

  // Retrieve a single User with userId
  app.get("/user/:id", user.findOne);

  // Retrieve all Users
  app.get("/user", user.findAll);

  // Update a User with user-id
  app.put("/user/:id", user.update);  
  
  // // Create a new user
  app.delete("/user/:id", checkToken, user.delete);

  app.put("/update-pwd", checkToken, user.updatePwd);

};