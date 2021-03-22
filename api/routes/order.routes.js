module.exports = app => {
    const order = require("../controllers/order.controller.js");
    const { checkToken } = require("../models/token_validation");

    app.get("/order", checkToken, order.findUserOrder);
    
    // Retrieve all order
    app.get("/orders", checkToken, order.findAll);    
    
    // Create a new order
    app.post("/order", checkToken, order.create);   

    // Delete a order by id
    app.delete("/order/:id", checkToken, order.delete);

};