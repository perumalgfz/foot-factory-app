const Order = require("../models/order.model.js");

exports.findAll = (req, res) => {
    Order.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Order."
            });
        else res.send(data);
    });
};

exports.findUserOrder = (req, res) => {
    Order.getUserOrder((req.user.id), (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Order."
            });
        else res.send(data);
    });
};

//   Create and Save a new Ingredient:
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Create a Food
    const order = new Order({
        status: req.body.status,
        dateOfdelivery: req.body.dateOfdelivery,
        modeOfTransport: req.body.modeOfTransport,
        created_at: req.body.created_at
    });

    var updated_at = {
        user_id: req.user.id
    }
    var orderDetail = Object.assign(req.body, updated_at);

    // Save Food in the database
    Order.create(orderDetail, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Ingredient."
            });
        } else {
            // console.log(data.affectedRows)
            res.json({ "status": "Order Created" })
        }
    });

};

// Find a single Ingredient with a id
exports.findOne = (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.send({
            message: 'This is NOT a number'
        });
    }
    Ingredient.findFood(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found Ingredient with id: ${req.params.id}`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving Ingredient with id " + req.params.id
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

    Ingredient.updateById(req.params.id, (req.body), (err, data) => {

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
                    message: "Error updating Ingredient with id " + req.params.id
                });
            }
        } else res.send(data);
    }
    );
};

//DELETE Ingredient By id
exports.delete = (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.send({
            message: 'This is NOT a number'
        });
    }

    Order.remove(req.params.id, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete Order " + req.params.id
                });
            }
        } else res.send({ message: `ID: ${req.params.id} Order was deleted successfully! ` });
    });
};