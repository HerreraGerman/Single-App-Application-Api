const mongoose = require('mongoose');
const User = require('./user'); // Importa el modelo de usuario
const { Schema, model } = mongoose;

const projectSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    members: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }],
    description: {
        type: String,
        required: false
    },
    icon: {
        type: String,
        required: false
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: true
    }
})

const Project = model('Project', projectSchema);
module.exports = Project;