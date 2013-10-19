angular.module('MediaBrowser.directives').directive('mediaShowsTrack', [function() {
  'use strict';

  return {
    restrict: 'EA',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: { },
    controller: ['$scope', function($scope) {
      $scope.selected = null;

      this.updateSelected = function(selected) {
        $scope.selected = selected;
      };

      this.on = function(eventName, fn) {
        if (eventName === 'selected') {
          $scope.$watch('selected', function(selected) {
            if (selected) {
              fn(selected);
            }
          });
        }
      };
    }]
  };
}]);
