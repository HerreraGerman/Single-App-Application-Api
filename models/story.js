const mongoose = require('mongoose');
const User = require('./user');
const Epic = require('./epic');
const { Schema, model } = mongoose;

const storySchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false,
    },
    Epic: {
        type: Schema.Types.ObjectId,
        ref: Epic,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: User,
        required: false
    },
    assignedTo: [{
        type: Schema.Types.ObjectId,
        ref: User,
        required: false
    }],
    points: {
        type: Number,
        required: false,
        default: 0,
        min: 0,
        max: 5,
    },
    created: {
        type: Date,
        default: Date.now,
        required: false
    },
    due: {
        type: Date,
        required: false
    },
    started: {
        type: Date,
        required: false
    },
    finished: {
        type: Date,
        required: false
    },
    status: {
        type: String,
        enum: ['todo', 'running', 'done'],
        required: false,
        default: 'todo'
    },
    icon: {
        type: String,
        required: false
    }
})

const Story = model('Story', storySchema);
module.exports = Story;