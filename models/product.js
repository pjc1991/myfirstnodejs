const mongodb = require('mongodb');
const getDb = require('../util/database').getDb;

class Product {
    constructor(props) {
        this._id = props._id ? new mongodb.ObjectId(props._id) : null;
        this.title = props.title;
        this.price = props.price;
        this.imageUrl = props.imageUrl;
        this.description = props.description;
        this.userId = props.userId;
    }

    save() {
        const db = getDb();

        if (this._id) {
            return db.collection('products')
            .updateOne({ _id: this._id }, { $set: this })
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
        }
    

        return db.collection('products')
            .insertOne(this)
            .then(result => {
                console.log(result);
            })
            .catch(err => {
                console.log(err);
            });
    }

    static fetchAll() {
        const db = getDb();
        return db.collection('products')
        .find()
        .toArray()
        .then(products => {
            return products;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static findById(productId) {
        const db = getDb();
        return db.collection('products')
        .find({ _id: new mongodb.ObjectId(productId) })
        .next()
        .then(product => {
            return product;
        })
        .catch(err => {
            console.log(err);
        });
    }

    static deleteById(productId) {
        const db = getDb();
        return db.collection('products')
        .deleteOne({ _id: new mongodb.ObjectId(productId) })
        .then(result => {
            console.log('Deleted');
        })
        .catch(err => {
            console.log(err);
        });
    }
}

module.exports = Product;