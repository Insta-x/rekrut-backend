const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const notifSchema = new Schema({
    msg: String,
    url: String,
    read: {
        type: Boolean,
        default: false
    },
    category: {
        type: String,
        enum: ["important", "hired", "done", "done all", "chosen", "rejected", "basic"]
    }
})

module.exports = mongoose.model('Notification', notifSchema);
