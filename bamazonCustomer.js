'use strict';
const mysql = require('mysql');
const inquirer = require('inquirer');
// Declare empty array that will list products.  Connect to db.
var prod = [];
var connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: "root",
    password: "felisa",
    database: "Bamazon"
});
connection.connect(function(err) {
    if (err) throw err;
    console.log('connected as  ' + connection.threadId);
    getData()
})
var getData = function() {
    function getProducts(item, index) {
        var details = [item.id, item.product_name, item.price].join(" ");
        return details;
    }
    connection.query('SELECT * FROM products', function(err, res) {
        if (err) throw err;
        var newArr = res.map(getProducts);
        console.log(newArr)
        inquirer.prompt([{
            name: "item",
            type: "rawlist",
            message: "What item would you like to buy?",
            choices: newArr
        }, {
            name: "qty",
            type: "input",
            message: "How many would you like to buy?",
            validate: function(value) {
                connection.query('select inventory  from products where id = 3', function(err, res) {
                    if (err) throw err;
                })
                if (res[0].inventory >= value) {
                    return true;
                } else {
                    return 'Sorry we don\'t have that many in stock.  Try ordering fewer of these';
                }
            }
        }]).then(function(answer) {
            prod = answer.item;
            var splProd = prod.split(' ');
            var itemId = splProd[0];
            var qty = answer.qty;

        })

    });

}
