angular.module('MediaBrowser.directives').directive('mediaShowsList', ['ListFactory', function(ListFactory) {
  'use strict';

  return ListFactory.createDirective({
    templateUrl: 'app/directives/shows-list/shows-list.html',
    scope: {
      grabFocus: '@mediaGrabFocus',
      shows: '=mediaShows',
      hideEmpty: '=mediaHideEmpty'
    },
    listElement: '.shows-list',
    modelsName: 'shows',
    link: function($scope, $element, $list) {

      $scope.getClasses = function(show) {
        return {
          'show-selected': ($scope.selected && $scope.selected.id === show.id)
        };
      };

      $scope.hideIfEmpty = function(show) {
        return ( ! $scope.hideEmpty || show.episodes.length);
      };

      $scope.focusEpisodes = function($event) {
        $event.preventDefault();
        var $parent = $element, $episodes;
        while ($parent.length) {
          $episodes = $parent.find('.episodes-list');
          if ($episodes.length && $episodes.children().length) {
            $episodes.focus();
            break;
          }
          $parent = $parent.parent();
        }
      };

      if ($scope.grabFocus) {
        $list.focus();
      }
    }
  });
}]);
