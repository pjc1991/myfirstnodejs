const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bcrypt = require('bcryptjs');

const Order = require('./order');

const userSchema = new Schema({
    email: {
        type: String,
        require: true
    },
    password: {
        type: String,
        require: true
    },
    cart: {
        items: [{
            productId: {
                type: Schema.Types.ObjectId,
                ref: 'Product',
                required: true,
            },
            quantity: {
                type: Number,
                required: true
            }
        }]
    },
    resetToken: {
        type: String
    },
    resetTokenExpiration: {
        type: Date
    },
    emailValidateToken: {
        type: String
    },
    emailValidateTokenExpiration: {
        type: Date
    },
    emailValidated: {
        type: Boolean,
        default: false
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

userSchema.methods.addToCart = function (product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
        return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    let updatedCart;
    if (cartProductIndex >= 0) {
        newQuantity = this.cart.items[cartProductIndex].quantity + 1;
        const updatedCartItems = [...this.cart.items];
        updatedCartItems[cartProductIndex] = { productId: product._id, quantity: newQuantity };
        updatedCart = { items: updatedCartItems };

    }

    if (cartProductIndex < 0) {
        this.cart.items.push({
            productId: product._id,
            quantity: newQuantity
        });
        updatedCart = { items: this.cart.items };
    }

    this.cart = updatedCart;

    return this.save();
}

userSchema.methods.removeFromCart = function (productId) {
    const updatedCartItems = this.cart.items.filter(item => {
        return item.productId.toString() !== productId.toString();
    });
    this.cart.items = updatedCartItems;
    return this.save();

}

userSchema.methods.clearCart = function () {
    this.cart = { items: [] };
    return this.save();
}

userSchema.methods.createResetToken = function () {
    this.resetToken = require('crypto').randomBytes(32).toString('hex');
    this.resetTokenExpiration = Date.now() + 60 * 60 * 1000;
    return this.save();
}

userSchema.methods.changePassword = function (password) {
    this.password = bcrypt.hashSync(password, 12);
    this.resetToken = null;
    this.resetTokenExpiration = null;
    return this.save();
}

userSchema.methods.createEmailValidateToken = function () {
    this.emailValidateToken = require('crypto').randomBytes(32).toString('hex');
    this.emailValidateTokenExpiration = Date.now() + 60 * 60 * 1000;
    return this.save();
}

userSchema.methods.validateEmail = function () {
    this.emailValidated = true;
    this.emailValidateToken = null;
    this.emailValidateTokenExpiration = null;
    return this.save();

}

module.exports = mongoose.model('User', userSchema);


// const mongodb = require('mongodb');
// const getDb = require('../util/database').getDb;

// class User {
//     constructor(props) {
//         this._id = props._id ? new mongodb.ObjectId(props._id) : null;
//         this.name = props.name;
//         this.email = props.email;
//         this.cart = props.cart;
//     }

//     save() {
//         const db = getDb();

//         if (this._id) {
//             return db.collection('users')
//                 .updateOne({ _id: this._id }, { $set: this })
//                 .then(result => {
//                     console.log(result);
//                 })
//                 .catch(err => {
//                     console.log(err);
//                 });
//         }

//         return db.collection('users')
//             .insertOne(this)
//             .then(result => {
//                 console.log(result);
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     static findById(userId) {
//         const db = getDb();

//         return db.collection('users')
//             .findOne({ _id: new mongodb.ObjectId(userId) });
//     }

//     static fetchAll() {
//         const db = getDb();

//         return db.collection('users')
//             .find()
//             .toArray()
//             .then(users => {
//                 return users;
//             })
//             .catch(err => {
//                 console.log(err);
//             });
//     }

//     addToCart(product) {
//         const cartProductIndex = this.cart.items.findIndex(cp => {
//             return cp.productId.toString() === product._id.toString();
//         });

//         let newQuantity = 1;
//         let updatedCart;
//         if (cartProductIndex >= 0) {
//             newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//             const updatedCartItems = [...this.cart.items];
//             updatedCartItems[cartProductIndex] = { productId: new mongodb.ObjectId(product._id), quantity: newQuantity };
//             updatedCart = { items: updatedCartItems };

//         }

//         if (cartProductIndex < 0) {
//             this.cart.items.push({
//                 productId: new mongodb.ObjectId(product._id),
//                 quantity: newQuantity
//             });
//             updatedCart = { items: this.cart.items };
//         }

//         const db = getDb();

//         return db.collection('users').updateOne({ _id: this._id }, { $set: { cart: updatedCart } });
//     }

//     getCart() {
//         const db = getDb();
//         const productIds = this.cart.items.map(i => {
//             return i.productId;
//         });
//         return db
//             .collection('products')
//             .find({ _id: { $in: productIds } })
//             .toArray()
//             .then(products => {
//                 const wrongProductIds = productIds.filter(id => {
//                     return !products.some(p => {
//                         return p._id.toString() === id.toString();
//                     });
//                 });

//                 if (wrongProductIds.length > 0) {
//                     wrongProductIds.forEach(id => {
//                         this.deleteItemFromCart(id);
//                     });
//                 }

//                 return products;
//             })
//             .then(products => {
//                 return products.map(p => {
//                     return {
//                         ...p,
//                         quantity: this.cart.items.find(i => {
//                             return i.productId.toString() === p._id.toString();
//                         }).quantity
//                     };
//                 })
//             })
//     }

//     deleteItemFromCart(productId) {
//         const updatedCartItems = this.cart.items.filter(item => {
//             return item.productId.toString() !== productId.toString();
//         })
//         const updatedCart = { items: updatedCartItems };

//         const db = getDb();
//         return db.collection('users').updateOne(
//             { _id: this._id },
//             { $set: { cart: updatedCart } }
//         );
//     }

//     addOrder() {
//         const db = getDb();
//         return this.getCart()
//             .then(products => {
//                 const order = {
//                     items: products,
//                     user: {
//                         _id: new mongodb.ObjectId(this._id),
//                         name: this.name,
//                         email: this.email
//                     }
//                 }
//                 return db
//                     .collection('orders')
//                     .insertOne(order)
//             })
//             .then(result => {
//                 this.cart = { items: [] }
//                 return db
//                     .collection('users')
//                     .updateOne(
//                         { _id: new mongodb.ObjectId(this._id) },
//                         { $set: { cart: this.cart } }
//                     );
//             })
//             .catch(err => {
//                 console.log(err);
//             })
//     }

//     getOrders() {
//         const db = getDb();
//         return db.collection('orders').find({ 'user._id' : new mongodb.ObjectId(this._id) }).toArray();
//     }


// }

// module.exports = User;