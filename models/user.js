const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Client = require('../models/client');
const Worker = require('../models/worker');
const Review = require('../models/review');

const userSchema = new Schema({
    name: String,
    phone: String,
    bankAccount: String,
    category: String,
    email: {
        type: String,
        required: true,
        unique: true
    },
    bio: String,
    worker: {
        type: Schema.Types.ObjectId,
        ref: 'Worker'
    },
    client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    review: [{
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }],
    overallRating: Number
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        doc.worker
            ? await Worker.deleteOne(doc.worker)
            : await Client.deleteOne(doc.worker)
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('User', userSchema);
