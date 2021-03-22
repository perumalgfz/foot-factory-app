module.exports = app => {
    const ingredient = require("../controllers/ingredient.controller.js");
    const { checkToken } = require("../models/token_validation");

    // Retrieve all ingredient
    app.get("/ingredient", checkToken, ingredient.findAll);
    
    // Create a new ingredient
    app.post("/ingredient", checkToken, ingredient.create);

    // Retrieve a single ingredient By ingredient Id
    app.get("/ingredient/:id", checkToken, ingredient.findOne);

    // Update a ingredient by id
    app.put("/ingredient/:id", checkToken, ingredient.update);   

    // Delete a ingredient by id
    app.delete("/ingredient/:id", checkToken, ingredient.delete);

};