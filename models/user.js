const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        first: {
            type: String,
            required: false
        },
        last: {
            type: String,
            required: false
        }
    }
})

module.exports = mongoose.model('User', userSchema)