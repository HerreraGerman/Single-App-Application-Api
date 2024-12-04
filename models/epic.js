const mongoose = require('mongoose');
const Project = require('./project'); // Importa el modelo de usuario

const { Schema, model } = mongoose;

const epicSchema = new Schema({
    Project: {
        type: Schema.Types.ObjectId,
        ref: Project,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
});

const Epic = model('Epic', epicSchema);
module.exports = Epic;