(function ($, TimeLineWidget) {
  $(document).ready(function () {
    // Create and destroy the controller
    // Show how destroy unbinds all the handlers
    var widget = new TimeLineWidget($('#twitter-box'));
    widget.destroy();

    // Create two instances in the same page
    // Show that the controller works well on each instace witout overlapping
    var widget2 = new TimeLineWidget($('#twitter-box'));
    var widget3 = new TimeLineWidget($('#twitter-box2'));
  });  
})(jQuery, TimeLineWidget);
