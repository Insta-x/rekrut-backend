const mongoose = require('mongoose');
const { schema } = require('./user');
const Schema = mongoose.Schema;

const jobSchema = new Schema({
    title: String,
    detail: String,
    location: String,
    jobType: String,
    category: String,
    salary: String,
    responsibility: String,
    qualification: String,
    status: {
        type: String,
        enum : ['HIRING', 'WAITING', 'ONGOING', 'REVIEWING', 'DONE'],
        default: 'HIRING'
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    registrants: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Worker'
        }
    ],
    chosen: {
        type: Schema.Types.ObjectId,
        ref: 'Worker'
    },
    review: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

module.exports = mongoose.model('Job', jobSchema);
