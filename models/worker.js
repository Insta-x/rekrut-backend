const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
    company: String,
    rejected: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    pending: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    hired: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

module.exports = mongoose.model('Worker', workerSchema);
