angular.module('MediaBrowser.directives').directive('mediaEpisodesList', ['ListFactory', function(ListFactory) {
  'use strict';

  return ListFactory.createDirective({
    templateUrl: 'app/directives/episodes-list/episodes-list.html',
    scope: {
      episodes: '=mediaEpisodes'
    },
    listElement: '.episodes-list',
    modelsName: 'episodes',
    link: function($scope, $element, $list) {

      $scope.focusShows = function($event) {
        $event.preventDefault();
        var $parent = $element, $shows;
        while ($parent.length) {
          $shows = $parent.find('.shows-list');
          if ($shows.length) {
            $shows.focus();
            break;
          }
          $parent = $parent.parent();
        }
      };

      $scope.getClasses = function(episode) {
        return {
          'episode-selected': ($scope.selected && $scope.selected.id === episode.id)
        };
      };
    }
  });
}]);
