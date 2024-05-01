// REQUIREMENTS
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const sequelize = require('./util/database');
const app = express();

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const errorsController = require('./controllers/errors');

const Product = require('./models/product');
const User = require('./models/user');
const Cart = require('./models/cart');
const CartItem = require('./models/cartItem');
const Order = require('./models/order');
const OrderItem = require('./models/orderItem');

// EXPRESS CONFIG
app.set('view engine', 'ejs');
app.set('views', 'views');

// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

// DB relations
Product.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
Product.belongsToMany(User, { through: CartItem });
User.hasMany(Product);

Cart.belongsTo(User);
User.hasOne(Cart);

CartItem.belongsTo(Cart);
Cart.hasMany(CartItem);

CartItem.belongsTo(User, { constraints: true, onDelete: 'CASCADE' });
CartItem.belongsTo(Product);
Cart.belongsToMany(Product, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

OrderItem.belongsTo(Order);
OrderItem.belongsTo(Product);
Order.belongsToMany(Product, { through: OrderItem });




// User middleware to add user to request (for testing purposes only)
app.use((req, res, next) => {
    User.findByPk(1)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => {
            console.log(err);
        });
});


// ROUTES
app.use('/admin', adminRoutes);
app.use('/', shopRoutes);
app.use(errorsController.getNotFound);


// MIDDLEWARE
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));


// DB connection
sequelize
    // .sync({ force: true })
    .sync()
    .then(() => {
        return User.findByPk(1);
    })
    .then(user => {
        if (!user) {
            return User.create({
                name: 'test',
                email: ''
            });
        }
        return Promise.resolve(user);
    })
    .then(user => {
        return user.createCart();
    })
    .then(cart => {
        app.listen(3000);
    })
    .catch(err => {
        console.log(err);
    });
