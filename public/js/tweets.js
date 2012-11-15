/**
 * Widget for displaying a twitter timeline 
 * Requires: jQuery
 * Exports: TimeLineWidget
 */
(function ($, exports) {

  /**
   * Model for tweets
   * @param  {String} user time line
   * @return {jQuery.deferred} Deferred to attach callbacks
   */
  var getTweets = function (user) {
    // Get the tweets from the server
    return $.ajax({
      url: 'https://api.twitter.com/1/statuses/user_timeline.json?' +
        'include_entities=true&include_rts=true' +
        '&screen_name=' + user,    // server endpoint to get the tweets
      contentType: 'jsonp',          // tells jQuery that we expect a json
      dataType: 'jsonp'          // tells jQuery that we expect a json
    });  
  }

  /**
   * Controller for displaying tweets base on a user time line
   * @param {jQuery} container where the widget will display
   * @param {Object} options fit the widget
   */
  exports.TimeLineWidget = function (container, options) {
    
    /**
     * Inner representation of the last tweets, used by the api
     * @type {Array}
     */
    var self = this;   
    self.tweets = [];

    /**
     * Private variables
     */
    var user = container.find('#user'),
        button = container.find('.button'),
        tweetBox = container.find('.content'),
        notification = $('<div class="notification">Loading...</div>');

    /**
     * Renders tweets inside the box
     * @param  {Array} tweets 
     */
    var renderTweets = function (tweets) {
      // clean the box
      tweetBox.empty();

      // if error show the message
      var error = tweets.error ? tweets.error :
                  tweets.errors ? tweets.errors[0].message : '';

      if (error) {
        this.tweetBox.append(error);
        return;
      }
      
      // if no tweets, show a message
      if (tweets.length === 0) {
        tweetBox.append('No tweets for this user yet');
      }

      // Render each tweet
      $.each(tweets, function (index, tweet) {
        tweetBox.append(renderTweet(tweet));
      })
    };

    /**
     * Generates the HTML for a single tweet
     * @param  {Object} tweet
     * @return {String} HTML for a single tweet
     */
    var renderTweet = function (tweet) {
      return '<div class="tweet tweet-' + tweet.id + '">' +
        '<img  " src="' + tweet.user.profile_image_url + '" />' +
        '<p class="text"><span class="username"><a href="https://twitter.com/' +
        tweet.user.screen_name + '"target=_blank rel="external">' + 
        tweet.user.screen_name + '</a>:</span> ' + tweet.text + '</p></div>';
    };

    /**
     * Handler for retrieving the tweets
     * @param  {jQuery} el the target element
     * @param  {jQuery.event} event generated
     */
    button.on('click', function (el, event) {

      // Get the user that we want the timeline
      var userName = $.trim(user.val());

      // Dont do nothing if there's not a user defined
      if (!userName) return false;

      // Shows the loading indicator
      container.append(notification);

      // success callback
      getTweets(userName).success(function (data) {
        self.tweets = data;
        renderTweets(data);

      // error callback
      }).error(function (jqXHR, textStatus) {
        console.log(textStatus);
        tweetBox.html('Something went wrong, please try again');

      // always callback
      }).always(function () {
        notification.detach();
      });  
    });

    /**
     * API
     */
    return {
      getLastTweets: function (user) {
        return this.tweets;
      },
      destroy: function () {
        button.off('click');
      }
    };
  };
})(jQuery, window);
