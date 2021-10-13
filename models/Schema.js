const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
    username: {
        type: String,
        required: true
    }
})

const log = new Schema({
    username: {
        type: String,
        required: true
    },
    count: Number,
    Log: {
        type: [{
            duration: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true
            },
            date: Date,
            _id: false
        }],
    }
});

const users = mongoose.model('user', user);
const logs = mongoose.model('log', log)

module.exports = { users, logs };