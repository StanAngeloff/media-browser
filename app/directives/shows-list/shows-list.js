angular.module('MediaBrowser.directives').directive('mediaShowsList', ['$timeout', function($timeout) {
  'use strict';

  return {
    restrict: 'EA',
    templateUrl: 'app/directives/shows-list/shows-list.html',
    scope: {
      grabFocus: '@mediaGrabFocus',
      shows: '=mediaShows'
    },
    require: ['^?mediaShowsTrack'],
    link: function($scope, $element, $attributes, controllers) {

      $scope.selected = null;

      var trackController = controllers[0];
      if (trackController) {
        trackController.on('selected', function(selected) {
          $scope.selected = selected;
        });
      }

      var $list = $element.children('.shows-list');

      function findElementById(id) {
        if (id === ':first') {
          return $element.find('[data-show-id]').first();
        } else {
          return $element.find('[data-show-id="' + id + '"]');
        }
      }

      function findShowById(id) {
        var found;
        if ($scope.shows) {
          $scope.shows.forEach(function(show) {
            if ('' + show.id === '' + id) {
              found = show;
            }
          });
        }
        return found;
      }

      $scope.$watch('shows', function() {
        $timeout(function() {
          $scope.select(':first');
        }, false);
      });

      $scope.getClasses = function(show) {
        return {
          'show-selected': ($scope.selected && $scope.selected.id === show.id)
        };
      };

      $scope.focus = function() {
        $list.focus();
      };

      $scope.select = function($event, direction) {
        if (typeof direction === 'undefined') {
          direction = $event;
        } else {
          $event.preventDefault();
        }
        var $target;
        if (direction.indexOf(':') === 0) {
          $target = findElementById(direction);
        } else {
          $target = findElementById($scope.selected.id)[direction]();
        }
        if ($target.length) {
          var selected = findShowById($target.data('showId'));
          if (trackController) {
            trackController.updateSelected(selected);
          } else {
            $scope.selected = selected;
          }
          if ($scope.grabFocus) {
            $scope.focus();
          }
        }
      };

      var scrollPromise;
      $scope.$watch('selected', function() {
        if (scrollPromise) {
          $timeout.cancel(scrollPromise);
        }
        scrollPromise = $timeout(function() {
          scrollPromise = null;

          if ( ! $scope.selected) {
            return false;
          }

          var $target = findElementById($scope.selected.id);
          if ( ! $target.length) {
            return false;
          }

          var listWidth = $list.width(),
              listHeight = $list.height(),
              targetWidth = $target.width(),
              targetHeight = $target.height();

          $list.stop().animate({
            scrollTop: ($target[0].offsetTop + (targetHeight / 2) - (listHeight / 2)),
            scrollLeft: ($target[0].offsetLeftleft + (targetWidth / 2) - (listWidth / 2))
          }, 175);

        }, 15, false);
      });
    }
  };
}]);
