const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const clientSchema = new Schema({
})

module.exports = mongoose.model('User', clientSchema);
