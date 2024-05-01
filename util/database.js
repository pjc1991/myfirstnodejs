const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

const mongoConnect = callback => {
    console.log('Connecting...');
    MongoClient.connect('mongodb://mongo:27017/shop')
    .then(client => {
        console.log('Connected!');
        callback(client);
    })
    .catch(err => {
        console.log(err);
    });
};

module.exports = mongoConnect;
