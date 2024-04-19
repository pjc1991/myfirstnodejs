const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const p = path.join(path.dirname(require.main.filename), 'data', 'cart.json');
const getCartFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Cart {
    constructor(props) {
        this.id = uuid.v4();
        this.user = props.user;
        this.product = props.product;
        this.quantity = props.quantity;
    }

    save() {
        getCartFromFile((cart) => {
            cart.push(this);
            fs.writeFile(p, JSON.stringify(cart), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getCartFromFile(callback);
    }

    static deleteAll(userId, callback) {
        getCartFromFile((cart) => {
            const updatedCart = cart.filter(item => item.user !== userId);
            fs.writeFile(p, JSON.stringify(updatedCart), (err) => {
                console.log(err);
            });
        });
    }  
}