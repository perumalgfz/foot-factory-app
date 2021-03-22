const Ingredient = require("../models/ingredient.model.js");

exports.findAll = (req, res) => {
    Ingredient.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Ingredient."
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
    const ingredient = new Ingredient({
        name: req.body.name,
        lotNumber: req.body.lotNumber,
        availableQuantity: req.body.availableQuantity,
        thresholdQuantity: req.body.thresholdQuantity,
        price: req.body.price,
        vendorName: req.body.vendorName,
        vendorEmail: req.body.vendorEmail,
        created_at: req.body.created_at
    });

    // Save Food in the database
    Ingredient.create(ingredient, (err, data) => {
        if (err) {
            res.status(500).send({
                message:
                    err.message || "Some error occurred while creating the Ingredient."
            });
        } else {
            if (data.reg_status == 'exists') {
                return res.status(400).json({ "error": "This 'Lot Number' already exists" })
            }

            console.log(data.affectedRows)
            res.json({ "status": "created" })
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

    Ingredient.remove(req.params.id, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete Ingredient " + req.params.id
                });
            }
        } else res.send({ message: `ID: ${req.params.id} Ingredient was deleted successfully! ` });
    });
};