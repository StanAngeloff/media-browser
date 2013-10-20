angular.module('MediaBrowser.common').factory('ListFactory', ['$timeout', function($timeout) {
  'use strict';

  var utils = require('utils');

  var ListFactory = {};

  ListFactory.createDirective = function(options) {
    var linkFn;

    options = (options || {});
    if (typeof options.link === 'function') {
      linkFn = options.link;
      delete options.link;
    }

    return utils.extend({
      restrict: 'EA',
      scope: { },
      require: ['^?mediaTrack'],
      link: function($scope, $element, $attributes, controllers) {

        $scope.selected = null;

        var trackController = controllers[0];
        if (trackController) {
          trackController.on('selected', function(selected) {
            $scope.selected = selected;
          });
        }

        $scope.$watch(options.modelsName, function(models) {
          if (models) {
            $timeout(function() {
              $scope.select(':first');
            });
          }
        });

        var $list = $element.children(options.listElement);

        function findElementById(id) {
          if (id === ':first') {
            return $element.find('[data-model-id]').first();
          } else {
            return $element.find('[data-model-id="' + id + '"]');
          }
        }

        function findModelById(id) {
          var found;
          if ($scope[options.modelsName]) {
            $scope[options.modelsName].forEach(function(model) {
              if ('' + model.id === '' + id) {
                found = model;
              }
            });
          }
          return found;
        }

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
          if ( ! $target.length) {
            return false;
          }
          var selected = findModelById($target.attr('data-model-id'));
          if (trackController) {
            trackController.updateSelected(selected);
          } else {
            $scope.selected = selected;
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

        if (typeof linkFn === 'function') {
          linkFn.apply(this, [$scope, $element, $list]);
        }
      }
    }, options);
  };

  return ListFactory;
}]);
