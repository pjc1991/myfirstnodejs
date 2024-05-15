const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const productSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    userId : {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category : {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    createdAt : {
        type: Date,
        default: Date.now
    },
});

module.exports = mongoose.model('Product', productSchema);

// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class Product {
//     constructor(props) {
//         this._id = props._id ? new mongodb.ObjectId(props._id) : null;
//         this.title = props.title;
//         this.price = props.price;
//         this.imageUrl = props.imageUrl;
//         this.description = props.description;
//         this.userId = props.userId;
//     }

//     save() {
//         const db = getDb();

//         if (this._id) {
//             return db.collection('products')
//             .updateOne({ _id: this._id }, { $set: this })
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//         }
    

//         return db.collection('products')
//             .insertOne(this)
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static fetchAll() {
//         const db = getDb();
//         return db.collection('products')
//         .find()
//         .toArray()
//         .then(products => {
//             return products;
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

//     static findById(productId) {
//         const db = getDb();
//         return db.collection('products')
//         .find({ _id: new mongodb.ObjectId(productId) })
//         .next()
//         .then(product => {
//             return product;
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }

//     static deleteById(productId) {
//         const db = getDb();
//         return db.collection('products')
//         .deleteOne({ _id: new mongodb.ObjectId(productId) })
//         .then(result => {
//             console.log('Deleted');
//         })
//         .catch(err => {
//             console.log(err);
//         });
//     }
// }

// module.exports = Product;