const sql = require("./db.js");

var now = new Date().toISOString();
var currnetDate = now.slice(0, 19).replace('T', ' ');


// constructor
const Order = function (order) {
    this.orderNum = order.orderNum;
    this.status = order.status;
    this.orderDate = currnetDate
    this.dateOfdelivery = order.dateOfdelivery;
    this.modeOfTransport = order.modeOfTransport;
    this.created_at = currnetDate;
};

//Get All Order items
Order.getAll = result => {
    let query = 'SELECT b.*, a.item_qty, a.item_price, f.name as foodName, f.cuisine FROM `order_detail` as a LEFT JOIN `orders` as b ON a.order_id = b.orderNum LEFT JOIN `food` as f ON a.item_id = f.id ';
    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.length > 0) {
            console.log("count:" + res.length)
            // console.log("Orders : ", res);
            result(null, res);
        }
    });
};

//Get User Order Details
Order.getUserOrder = (userId, result) => {

    let query = `SELECT b.*, a.item_qty, a.item_price, f.name as foodName, f.cuisine FROM order_detail as a LEFT JOIN orders as b ON a.order_id = b.orderNum LEFT JOIN food as f ON a.item_id = f.id WHERE a.user_id = ${userId} `;

    sql.query(query, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }
        if (res.length > 0) {
            console.log("count:" + res.length)
            // var orderDetails = {
            //     orderNum: res[0].orderNum,
            //     status: res[0].status,
            //     orderDate: res[0].orderDate,
            //     dateOfdelivery: res[0].dateOfdelivery,
            //     modeOfTransport: res[0].modeOfTransport,
            //     customerName: res[0].customerName,
            //     customerPhone: res[0].customerPhone,
            //     customerAddress: res[0].customerAddress,
            //     customerPincode: res[0].customerPincode,
            //     created_at: res[0].created_at,
            // }

            // console.log("orderDetails : ", orderDetails);
            result(null, res);
        }
    });
};

Order.findByUserId = (userId, cb) => {
    sql.query(`SELECT * FROM users WHERE id = ${userId}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            cb(err, null);
            return;
        }

        if (res.length) {
            // console.log("found User: ", res[0]);
            cb(res[0]);
            return;
        }

        // not found User with the id
        //   cb({ kind: "not_found" }, null);
    });
}

//Create Ingredient items
Order.create = (order, result) => {

    var itemArray = order.items;
    var orderId = '';

    try {
        const run = async () => {

            Order.findByUserId(order.user_id, function (results) {

                // console.log("userResults::")
                let userOrder = {
                    status: order.status,
                    orderDate: currnetDate,
                    dateOfdelivery: order.dateOfdelivery,
                    modeOfTransport: order.modeOfTransport,
                    customerName: results.name,
                    customerPhone: results.phoneNo,
                    customerAddress: results.address,
                    customerPincode: results.pincode,
                    created_at: currnetDate
                }

                sql.query("INSERT INTO orders SET ?", userOrder, (err, results) => {
                    if (err) {
                        console.log("error: ", err);
                        result(err, null);
                        return;
                    }
                    console.log("User Order created: ", { id: results.insertId, ...userOrder });
                    orderId = results.insertId; //ORDER ID
                });


                itemArray.forEach(async (item) => {

                    var sql_query = `SELECT * FROM food WHERE id = ${item.item_id} LIMIT 1`;
                    await sql.query(sql_query, (err, res) => {
                        if (err) {
                            console.log("error: ", err);
                            result(err, null);
                            return;
                        }

                        if (res.length) {
                            // console.log("found Food item: ", res);
                            var priceCal = (res[0].sellingCost * item.item_qty);

                            const orderDetails = {
                                order_id: orderId,
                                user_id: order.user_id,
                                item_id: item.item_id,
                                item_qty: item.item_qty,
                                item_price: res[0].sellingCost,
                                price: priceCal,
                            }

                            // INSERT ORDER ITEM DETAILS TO ORDER_DETAILS TABLE
                            sql.query("INSERT INTO order_detail SET ?", orderDetails, (err, res) => {
                                if (err) {
                                    console.log("error: ", err);
                                    result(err, null);
                                    return;
                                }
                                // console.log("Order Details created: ", { id: res.insertId, ...orderDetails });
                                return;
                            });
                        }
                    });
                });
            });
        };
        run();

    } catch (error) {
        result(null, { msg: 'Getting some error: ' + error.message });
        return;
    }
    result(null);
};


Order.findFood = (foodId, result) => {
    sql.query(`SELECT * FROM orders WHERE Id = ${foodId}`, (err, res) => {
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

Order.remove = (id, result) => {

    let run = async () => {
        try {
            const rows = await sql.query(`DELETE FROM order_detail WHERE order_id = ${id}`);
            const rows2 = await sql.query(`DELETE FROM orders WHERE orderNum = ${id}`);

        }
        catch (error) {
            result(null, { msg: 'Getting some error: ' + error.message });
            return;
        } finally {
            console.log('Finally....')
            return result(null, { msg: 'success' });
        }

    }
    run();
};

module.exports = Order;