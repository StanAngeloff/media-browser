angular.module('MediaBrowser.directives').directive('mediaShowThumbnail', [function() {
  'use strict';

  var utils = require('utils');

  return {
    restrict: 'EA',
    templateUrl: 'app/directives/show-thumbnail/show-thumbnail.html',
    scope: {
      show: '=mediaShow',
      classes: '&ngClass'
    },
    link: function($scope) {
      $scope.getClasses = function() {
        return utils.extend({
          'episodes-empty': ($scope.show.episodes.length < 1)
        }, $scope.classes());
      };
    }
  };
}]);
