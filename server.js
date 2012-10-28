var express = require('express')
  , path = require('path')
  , app = express()
  , keys = {
      'consumer_key': process.env.consumer_key
    , 'consumer_secret' : process.env.consumer_secret
    , 'access_token_key' : process.env.access_token_key
    , 'access_token_secret': process.env.access_token_secret
  }
  , tu = require('tuiter')(keys);

  
app.configure(function(){
  app.use(express.favicon());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.logger('dev'));
  app.use(express.errorHandler());
});

app.get('/api/tweets/:user', function api(req, res, next) {
  // set the response header
  res.setHeader('Content-Type', 'application/json');

  // get the timeline
  tu.userTimeline({screen_name: req.params['user']}, function (er, tweets) {
    res.end(JSON.stringify(tweets));
  });
});

app.listen(process.env.PORT || 80);
