const mongoose = require ('mongoose');
const Story = require ('./story');
const { Schema, model } = mongoose;

const taskSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: false
    },
    Story: {
        type: Schema.Types.ObjectId,
        ref: Story,
        required: true
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
    done: {
        type: Boolean,
        required: false,
        default: false
    }
})

const Task = model('Task', taskSchema);
module.exports = Task;