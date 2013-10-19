angular.module('MediaBrowser.controllers').controller('ShowMasterDetailCtrl', ['$scope', '$timeout', 'CrawlerService', 'ModelFactoryService', 'mediaLocations', function($scope, $timeout, Crawler, ModelFactory, mediaLocations) {
  'use strict';

  var path = require('path'),

      Q = require('q');

  $scope.shows = [];
  $scope.isLoading = true;

  function isShowFile(file) {
    return (/tvshow\.nfo$/.test(file));
  }

  Crawler.scan(mediaLocations).done(function(files) {
    var promises = [];
    files.forEach(function(file) {
      if (isShowFile(file)) {
        var location = path.dirname(file);
        promises.push(ModelFactory.fromXmlFile('ShowModel', file, { location: location }));
      }
    });
    Q.all(promises).done(function(shows) {
      var promises = shows.map(function(show) {
        var promises = [], deferred = Q.defer();
        files.forEach(function(file) {
          if (show.isEpisodeFile(file)) {
            promises.push(ModelFactory.fromXmlFile('EpisodeModel', file));
          }
        });
        Q.all(promises).done(function(episodes) {
          show.episodes = episodes;
          deferred.resolve(show);
        });
        return deferred.promise;
      });
      Q.all(promises).done(function(shows) {
        $scope.$apply(function() {
          $scope.shows = shows;
          $scope.isLoading = false;
        });
      });
    });
  });
}]);
