var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var dateFormatter = require('../helpers/RelativeDate.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {
    title: 'Home'
  });
});

router.get('/reviews', function(req, res) {
  Review.find({}, function(err, reviews) {
    if (err) {
      res.render('error', {
        error: err.toString(),
        message: "Reviews couldn't be retrieved"
      });
    } else {
      var formatted_reviews = [];

      reviews.forEach(function(_review){
        var review = {
          movie: _review.movie,
          title: _review.title,
          review: _review.review,
          date: dateFormatter(_review.date),
          score: _review.score
        };
        formatted_reviews.push(review);
      });
      res.render('reviews', {
        title: 'Reviews',
        reviews: formatted_reviews
      });
    }
  });
});

router.post('/review', function(req, res) {
  var review = new Review({
    movie: req.body.movie,
    title: req.body.title,
    review: req.body.review
  });
  review.save(function (err) {
    if (err) {
      res.render('error', {
        error: err.toString(),
        message: 'Review not saved'
      });
    } else {
      res.render('review', {
        movie: req.body.movie,
        title: req.body.title,
        review: req.body.review
      });
    }
  });
});

module.exports = router;
