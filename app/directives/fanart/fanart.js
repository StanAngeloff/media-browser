angular.module('MediaBrowser.directives').directive('mediaFanart', [function() {
  'use strict';

  return {
    restrict: 'EA',
    transclude: true,
    templateUrl: 'app/directives/fanart/fanart.html',
    scope: {
      preload: '=mediaPreload'
    },
    require: ['^mediaShowsTrack'],
    link: function($scope, $element, $attributes, controllers) {

      var $fanart = $element.find('.media-fanart');

      function appendImage(show, hidden) {
        var found;
        if ( ! hidden) {
          $fanart.children().each(function() {
            var $image = $(this);
            if ('' + $image.data('showId') === '' + show.id) {
              found = $image;
            } else {
              $image.removeClass('fanart-visible').addClass('fanart-hidden');
            }
          });
        }
        if (found) {
          found.removeClass('fanart-hidden').addClass('fanart-visible');
          found[(show.episodes.length < 1 ? 'add' : 'remove') + 'Class']('episodes-empty');
        } else {
          var $image = $('<div>');
          $image.addClass('media-fanart-image');
          $image.css('background-image', 'url(\'file://' + ('' + show.images.fanart).replace('\'', '\\\'') + '\')');
          $image.data('showId', show.id);
          if (hidden) {
            $image.addClass('fanart-hidden');
          }
          $fanart.append($image);
        }
      }

      var trackController = controllers[0];
      trackController.on('selected', function(selected) {
        appendImage(selected);
      });

      $scope.$watch('preload', function(preload) {
        if (preload) {
          preload.forEach(function(show) {
            appendImage(show, /* hidden = */ true);
          });
        }
      });
    }
  };
}]);
