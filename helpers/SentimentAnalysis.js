var sentiment = require('sentiment');
var spawn = require('child_process').spawn;
var nlp = require("nlp_compromise");
var simple_english = require('nlp_compromise/plugins/simple_english');
nlp.plugin(simple_english);

module.exports = function (review) {
  console.log(review);
  var text = nlp.text(review.review);
  text.normalized();
  text.simplify();
  text.contractions.expand();
  var input = '';
  for(var i = 0; i < text.sentences.length; i++) {
    input += text.sentences[i].str + '\n';
  }
  input = input.substring(0, input.length - 1); // trim last \n character
  var process = spawn('python', ['./pyscripts/vader.py', input]);
  var output = '';
  process.stdout.on('data', function(data) { output += data; });
  process.on('close', function(code) {
    if(code !== 0) {
      console.error('Wrong error code from python.');
      return;
    }
    review.score = parseFloat(output);
    review.save(function (err) {
      if (err) {
        console.error(err);
        console.error('A review sentiment analysis was not stored.');
      }
    });
  });
};