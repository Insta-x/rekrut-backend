const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    _worker: {
        type: Schema.Types.ObjectId,
        ref: 'Worker'
    },
    _client: {
        type: Schema.Types.ObjectId,
        ref: 'Client'
    }
})

userSchema.plugin(passportLocalMongoose, { usernameField: 'email' });

module.exports = mongoose.model('User', userSchema);