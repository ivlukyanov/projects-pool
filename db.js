const mongoose = require('mongoose'),
    debug = require('debug')('pool:db');

mongoose.Promise = global.Promise;

mongoose.connect('mongodb://127.0.0.1/pool', {
    useNewUrlParser: true,
    useCreateIndex: true,
    autoReconnect: true,
    reconnectTries: 1000,
    reconnectInterval: 5000,
});
const db = mongoose.connection;

db.on('error', function (err) {
    debug('Connection error:', err.message);
});
db.once('open', function callback() {
    debug("Connected to DB!");
});

module.exports = mongoose;