const Food = require("../models/food.model.js");

exports.findAll = (req, res) => {
    Food.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving Food."
            });
        else res.send(data);
    });
};

//   Create and Save a new Food:
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
        return res.status(400).send({
            message: "Content can not be empty!"
        });
    }
    // Create a Food
    const food = new Food({
        name: req.body.name,
        cuisine: req.body.cuisine,
        ingredients: req.body.ingredients,
        lotNumber: req.body.lotNumber,
        costOfProduction: req.body.costOfProduction,
        sellingCost: req.body.sellingCost,
        created_at: req.body.created_at
    });

    // Save Food in the database
    Food.create(food, (err, data) => {
        if (err) {
            res.status(500).send({
              message:
                err.message || "Some error occurred while creating the Food."
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

// Find a single Food with a id
exports.findOne = (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.send({
            message: 'This is NOT a number'
        });
    }
    Food.findFood(req.params.id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found food with id: ${req.params.id}`
                });
            } else {
                return res.status(500).send({
                    message: "Error retrieving food with id " + req.params.id
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

    Food.updateById(req.params.id, (req.body), (err, data) => {

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
                        message: "Error updating food with id " + req.params.id
                    });
                }
            } else res.send(data);
        }
    );
};

//DELETE Food By id
exports.delete = (req, res) => {
    if (Number.isNaN(Number(req.params.id))) {
        return res.send({
            message: 'This is NOT a number'
        });
    }

    Food.remove(req.params.id, (err) => {
        if (err) {
            if (err.kind === "not_found") {
                return res.status(404).send({
                    message: `Not found ${req.params.id}.`
                });
            } else {
                return res.status(500).send({
                    message: "Could not delete food " + req.params.id
                });
            }
        } else res.send({ message: `ID: ${req.params.id} Food was deleted successfully! ` });
    });
};