const fs = require('fs');
const uuid = require('uuid');
const path = require('path');
const p = path.join(path.dirname(require.main.filename), 'data', 'orders.json');
const getOrdersFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Order {
    constructor(props) {
        this.id = uuid.v4();
        this.orderItems = props.orderItems;
        this.user = props.user;
    }

    save() {
        getOrdersFromFile((orders) => {
            orders.push(this);
            fs.writeFile(p, JSON.stringify(orders), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getOrdersFromFile(callback);
    }
}
