var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res) {
  res.render('home', {
    title: 'Home'
  });
});

router.post('/review', function(req, res) {
  var review = req.body.review;
  res.render('review', {
    review: review
  });
});

module.exports = router;
