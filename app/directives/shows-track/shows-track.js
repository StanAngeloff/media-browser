angular.module('MediaBrowser.directives').directive('mediaShowsTrack', [function() {
  'use strict';

  return {
    restrict: 'EA',
    transclude: true,
    template: '<div ng-transclude></div>',
    scope: { },
    controller: ['$scope', function($scope) {
      $scope.selected = null;

      this.getSelected = function() {
        return $scope.selected;
      };

      this.setSelected = function(selected) {
        $scope.selected = selected;
      };
    }]
  };
}]);
