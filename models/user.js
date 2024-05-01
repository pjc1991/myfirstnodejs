const Sequelize = require('sequelize');

const sequelize = require('../util/database');
const Product = require('./product');
const CartItem = require('./cartItem');

const User = sequelize.define('user', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    }, 
    name: Sequelize.STRING,
    email: Sequelize.STRING
});

module.exports = User;