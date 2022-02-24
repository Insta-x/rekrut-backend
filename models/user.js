const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

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
    _worker: {
        type: Schema.Types.ObjectId,
        ref: 'Worker'
    },
    _client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    },
    review: {
        type: Schema.Types.ObjectId,
        ref: 'Review'
    }
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);
