const sql = require("./db.js");

var now = new Date().toISOString();
var currnetDate = now.slice(0, 19).replace('T', ' ');


// constructor
const Food = function (food) {
    this.name = food.name;
    this.cuisine = food.cuisine;
    this.ingredients = food.ingredients;
    this.lotNumber = 'f0_' + food.lotNumber;
    this.costOfProduction = food.costOfProduction;
    this.sellingCost = food.sellingCost;
    this.created_at = currnetDate;
};

//Get All food items
Food.getAll = result => {
    sql.query("SELECT * FROM food", (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("Food : ", res);
        result(null, res);
    });
};

//Create food items
Food.create = (newFood, result) => {
    sql.query(`SELECT * FROM food WHERE lotNumber = ?`, [newFood.lotNumber], (err, res) => {
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

            sql.query("INSERT INTO food SET ?", newFood, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }

                console.log("Food created: ", { id: res.insertId, ...newFood });
                result(null, { foodid: res.insertId, foodName: res.name });
            });

        }
    });
};


Food.findFood = (foodId, result) => {
    sql.query(`SELECT * FROM food WHERE Id = ${foodId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        if (res.length) {
            console.log("found Food: ", res[0]);
            result(null, res[0]);
            return;
        }
        // not found Food with the id
        result({ kind: "not_found" }, null);
    });
};

Food.updateById = (id, food, result) => {

    var fields = "";
    Object.keys(food).forEach(key => {
        fields = fields.concat(`${key} =  '${food[key]}',`);
    });
    fields = fields.slice(0, -1);

    var query = `UPDATE food SET ${fields} WHERE Id = ${id}`;

    sql.query(query, (err, res) => {
        if (err) {
            result({ kind: "MYQSLError" }, null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found food with the id
            result({ kind: "not_found" }, null);
            return;
        }
        console.log("updated food: ", { id: id, ...food });
        result(null, { id: id, ...food });
    });
};

Food.remove = (id, result) => {
    sql.query("DELETE FROM food WHERE id = ?", id, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        if (res.affectedRows == 0) {
            // not found Food with the id
            result({ kind: "not_found" }, null);
            return;
        }
        result(null, res, id);
    });
};

module.exports = Food;