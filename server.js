var express = require('express'); // call express
var app = express(); // define our app using express
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_database');
var Bear = require('./app/models/bear');
// configure app to use bodyParser()
// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true})); //Parses the text as URL encoded data (which is how browsers tend to send form data from regular forms set to POST) and exposes the resulting object (containing the keys and values) on req.body. For comparison; in PHP all of this is automatically done and exposed in $_POST.

app.use(bodyParser.json()); //Parses the text as JSON and exposes the resulting object on req.body.

//Only after setting the req.body
 // to the desirable contents will it call the next middleware in the stack, which can then access the request data without having to think about how to unzip and parse it.

var port = process.env.PORT || 8080; //set our PORT

var router = express.Router(); // get an instance of the express Router
//middleware to use for all requests
router.use(function(req, res, next){
  console.log('Something is definitely happening.');
  next();
});

router.route('/bears')
  .post(function(req, res){
      var bear = new Bear();
      bear.name = req.body.name;// set the bears name (comes from the request)
      bear.save(function(err){
        if (err)
          res.send(err)

        res.json({message: 'Bear Created!'});
      });
  })
  .get(function(req, res){
    Bear.find(function(err, bears){
      if (err)
        res.send(err);

      res.json(bears);
    });
  });

router.route('/bears/:bear_id')
  .get(function(req, res){
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err)
        res.send(err);
      res.json(bear);
    });
  })
  .put(function(req, res){
    Bear.findById(req.params.bear_id, function(err, bear) {
      if (err)
        res.send(err);
      bear.name = req.body.name;

      bear.save(function(err) {
        if (err)
          res.send(err);
        res.json({ message: 'Bear updated!'});
      });
    });
  })
  .delete(function(req, res){
    Bear.remove({
      _id: req.params.bear_id
    }, function(err, bear){
      if (err)
        res.send(err);
      res.json({ message : "Successfully Deleted!"});
    });
  });
// test route to make sure everything is working (accessed at GET http://localhost:8080/api)

router.get('/', function(req, res) {
  res.json({ message: 'horray! welcome, our api works!'});
});
// more routes for our API will happen here
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);
