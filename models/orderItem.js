const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const p = path.join(path.dirname(require.main.filename), 'data', 'orders.json');
const getOrderItemsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class OrderItem {
    constructor(props) {
        this.id = uuid.v4();
        this.quantity = props.quantity;
        this.product = props.product;
    }

    save() {
        getOrderItemsFromFile((orderItems) => {
            orderItems.push(this);
            fs.writeFile(p, JSON.stringify(orderItems), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getOrderItemsFromFile(callback);
    }
}