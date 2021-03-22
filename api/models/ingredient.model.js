const sql = require("./db.js");

var now = new Date().toISOString();
var currnetDate = now.slice(0, 19).replace('T', ' ');


// constructor
const Ingredient = function (ingredients) {
    this.name               = ingredients.name;
    this.lotNumber          = 'ing_' + ingredients.lotNumber;
    this.availableQuantity  = ingredients.availableQuantity;
    this.thresholdQuantity  = ingredients.thresholdQuantity;
    this.price              = ingredients.price;
    this.vendorName         = ingredients.vendorName;
    this.vendorEmail        = ingredients.vendorEmail;
    this.created_at         = currnetDate;
};

//Get All food items
Ingredient.getAll = result => {
    sql.query("SELECT * FROM ingredients", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("Food : ", res);
        result(null, res);
    });
};

//Create Ingredient items
Ingredient.create = (newFood, result) => {
    sql.query(`SELECT * FROM ingredients WHERE lotNumber = ?`, [newFood.lotNumber], (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("This Lot Number already exists: ", res[0].id + ' , ' + res[0].lotNumber);
            result(null, { reg_status: 'exists' });
            return;
        } else {

            sql.query("INSERT INTO ingredients SET ?", newFood, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                console.log("Ingredient created: ", { id: res.insertId, ...newFood });
                result(null, { foodid: res.insertId, foodName: res.name });
            });

        }
    });
};


Ingredient.findFood = (foodId, result) => {
    sql.query(`SELECT * FROM ingredients WHERE Id = ${foodId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Ingredient: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Ingredient with the id
        result({ kind: "not_found" }, null);
    });
};

Ingredient.updateById = (id, food, result) => {

    var fields = "";
    Object.keys(food).forEach(key => {
        if(key == 'lotNumber'){
            fields = fields.concat(`${key} =  'ing_${food[key]}',`);

        }else{
            fields = fields.concat(`${key} =  '${food[key]}',`);
        }
    });
    fields = fields.slice(0, -1);

    var query = `UPDATE ingredients SET ${fields} WHERE Id = ${id}`;

    sql.query(query, (err, res) => {
        if (err) {
            result({ kind: "MYQSLError" }, null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Ingredient with the id
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("updated Ingredient: ", { id: id, ...food });
        result(null, { id: id, ...food });
    });
};

Ingredient.remove = (id, result) => {
    sql.query("DELETE FROM ingredients WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Ingredient with the id
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res, id);
    });
};

module.exports = Ingredient;