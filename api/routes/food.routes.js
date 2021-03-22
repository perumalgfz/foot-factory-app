module.exports = app => {
    const food = require("../controllers/food.controller.js");
    const { checkToken } = require("../models/token_validation");

    // Retrieve all food
    app.get("/food", checkToken, food.findAll);
    
    // Create a new food
    app.post("/food", checkToken, food.create);

    // Retrieve a single food By food Id
    app.get("/food/:id", checkToken, food.findOne);

    // Update a food by id
    app.put("/food/:id", checkToken, food.update);   

    // Delete a Food by id
    app.delete("/food/:id", checkToken, food.delete);

};