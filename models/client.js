const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
    hiring: [
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
    done: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Job'
        }
    ]
})

module.exports = mongoose.model('Client', clientSchema);
