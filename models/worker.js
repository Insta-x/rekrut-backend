const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const workerSchema = new Schema({
    cv: {
        type: Buffer
    },
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
}, { toJSON: { virtuals: true } })

workerSchema.virtual('cvDataURL').get(function() {
    if(this.cv != null)
        return `data:application/pdf;charset=utf-8;base-64,${this.cv.toString('base64')}`
})

module.exports = mongoose.model('Worker', workerSchema);
