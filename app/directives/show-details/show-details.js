angular.module('MediaBrowser.directives').directive('mediaShowDetails', [function() {
  'use strict';

  return {
    restrict: 'EA',
    templateUrl: 'app/directives/show-details/show-details.html',
    scope: { },
    require: ['^mediaTrack'],
    link: function($scope, $element, $attributes, controllers) {
      $scope.show = null;
      var trackController = controllers[0];
      trackController.on('selected', function(selected) {
        $scope.show = selected;
      });
    }
  };
}]);
