/**
 * Widget for displaying a twitter timeline 
 * Requires: jQuery
 * Exports: TimeLineWidget
 */
(function ($, can, exports) {
  
  /**
   * Model for getting the tweets
   * @type {can.Model}
   */
  var Tweets = can.Model({
    findOne: '/api/tweets/{id}'
  },{});

  /**
   * Controller for displaying tweets base on a user time line
   * @param {jQuery} container where the widget will display
   * @param {Object} options fit the widget
   */
  exports.TimeLineWidget = can.Control({
    init: function (element, options) {

      /**
       * Inner representation of the last tweets, used by the api
       * @type {Array}
       */
      this.user = element.find('#user');
      this.button = element.find('.button');
      this.tweetBox = element.find('.content');
      this.notification = $('<div class="notification">Loading...</div>');
    },

    /**
     * Handler for retrieving the tweets
     * @param  {jQuery} el the target element
     * @param  {jQuery.event} event generated
     */
    '.button click': function (el, event) {
      var self = this;

      // Get the user that we want the timeline
      var userName = $.trim(this.user.val());

      // Dont do nothing if there's not a user defined
      if (!userName) return false;

      // Shows the loading indicator
      this.element.append(this.notification);

      // Fetch the data
      Tweets.findOne({id: userName}, function (model) {
        self.tweets = model.attr();
        self.renderTweets(self.tweets);

      // error callback
      }).fail(function (jqXHR, textStatus) {
       console.log(textStatus);
       self.tweetBox.html('Something went wrong, please try again');

      // always callback
      }).always(function () {
       self.notification.detach();
      });
    },

    /**
     * Renders tweets inside the box
     * @param  {Array} tweets 
     */
    renderTweets: function (tweets) {
      var self = this;

      // clean the box
      this.tweetBox.empty();

      // if error show the message
      var error = tweets.error ? tweets.error :
                  tweets.errors ? tweets.errors[0].message : '';

      if (error) {
        this.tweetBox.append(error);
        return;
      }

      // if no tweets, show a message
      if (tweets.length === 0) {
        this.tweetBox.append('No tweets for this user yet');
      }

      // Render each tweet
      $.each(tweets, function (index, tweet) {
        self.tweetBox.append(self.renderTweet(tweet));
      });
    },

    /**
     * Generates the HTML for a single tweet
     * @param  {Object} tweet
     * @return {String} HTML for a single tweet
     */
    renderTweet: function (tweet) {
      return '<div class="tweet tweet-' + tweet.id + '">' +
        '<img  " src="' + tweet.user.profile_image_url + '" />' +
        '<p class="text"><span class="username"><a href="https://twitter.com/' +
        tweet.user.screen_name + '"target=_blank rel="external">' + 
        tweet.user.screen_name + '</a>:</span> ' + tweet.text + '</p></div>';
    },

    /**
     * Get the last fetched tweets
     * @return {Array} Last fetched tweets
     */
    getLastTweets: function () {
      return this.tweets;
    }
  });

})(jQuery, can, window);
