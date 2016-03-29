var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Review = new Schema({
  movie: {type: String, required: true},
  title: { type: String, required: true},
  review: { type: String, required: true},
  score: Number,
  date: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Review', Review);