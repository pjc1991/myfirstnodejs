const fs = require('fs');
const path = require('path');
const uuid = require('uuid');
const p = path.join(path.dirname(require.main.filename), 'data', 'products.json');
const getProductsFromFile = (callback) => {
    fs.readFile(p, (err, fileContent) => {
        if (err) {
            return callback([]);
        }
        callback(JSON.parse(fileContent));
    });
}

module.exports = class Product {
    constructor(props) {
        this.id = uuid.v4();
        this.title = props.title;
        this.imageUrl = props.imageUrl;
        this.price = props.price;
        this.description = props.description;
    }

    save() {
        getProductsFromFile((products) => {
            products.push(this);
            fs.writeFile(p, JSON.stringify(products), (err) => {
                console.log(err);
            });
        });
    }

    static fetchAll(callback) {
        getProductsFromFile(callback);
    }

    static fetchById(id, callback) {
        getProductsFromFile((products) => {
            const product = products.find(p => p.id === id);
            callback(product);
        });
    }
}