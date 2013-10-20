angular.module('MediaBrowser.directives').directive('mediaEpisodeDetails', [function() {
  'use strict';

  return {
    restrict: 'EA',
    templateUrl: 'app/directives/episode-details/episode-details.html',
    scope: { },
    require: ['^mediaTrack'],
    link: function($scope, $element, $attributes, controllers) {
      $scope.episode = null;
      var trackController = controllers[0];
      trackController.on('selected', function(selected) {
        $scope.episode = selected;
      });
    }
  };
}]);
