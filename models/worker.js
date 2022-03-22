const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
    applying: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    accepted: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    ongoing: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ],
    finished: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

module.exports = mongoose.model('Worker', workerSchema);
