const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');
const Client = require('./client');
const Worker = require('./worker');
const Review = require('./review');

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
    website: String,
    skill: String,
    experience: String,
    education: String,
    award: String,
    profPic: String,
    notif: [{
        type: Schema.Types.ObjectId,
        ref: 'Notification'
    }],
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
    sumRating: Number,
    rating: Number
}, { toJSON: { virtuals: true } })

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

userSchema.virtual('profPicDataURL').get(function() {
    if(this.profPic != null && this.profPicType != null)
        return `data:${this.profPicType};charset=utf-8;base-64,${this.profPic.toString('base64')}`
})

userSchema.post('findOneAndDelete', async function (doc) {
    if (doc) {
        doc.worker
            ? await Worker.deleteOne(doc.worker)
            : await Client.deleteOne(doc.client)
        await Review.deleteMany({
            _id: { $in: doc.reviews }
        })
    }
})

module.exports = mongoose.model('User', userSchema);
