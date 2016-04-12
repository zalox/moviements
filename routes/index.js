var express = require('express');
var router = express.Router();
var Review = require('../models/review');
var dateFormatter = require('../helpers/RelativeDate.js');
var sentimentAnalysis = require('../helpers/SentimentAnalysis.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {
    title: 'Home'
  });
});

router.get('/add', function(req, res) {
  res.render('form', {
    title: 'Review'
  });
});


router.get('/reviews/:json?', function(req, res) {
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
          id: _review._id,
          movie: _review.movie,
          title: _review.title,
          review: _review.review,
          date: dateFormatter(_review.date),
          score: _review.score
        };
        formatted_reviews.push(review);
      });
      if(req.params.json){
        res.json(formatted_reviews);
      } else {
        res.render('reviews');
      }
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
  sentimentAnalysis(review);
});

module.exports = router;
