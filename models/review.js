const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
})

module.exports = mongoose.model('Review', reviewSchema);

/*
{
    "body": "Great person",
    "rating": 5,
    "author": "621e2f269e38d340a839d458"
}
{
    "body": "Did shit job but im rich",
    "rating": 3,
    "author": "6225a51cc82d9a2605d23f38"
}

*/

