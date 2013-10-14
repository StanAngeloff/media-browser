/*global angular */

(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path');

  var xml2js = require('xml2js');

  var app = angular.module('MediaBrowser', []);

  app.value('locations', ['/home/stan/Videos']);

  function image() {
    var absolute = path.join.apply(path, arguments);
    if (fs.existsSync(absolute)) {
      return absolute;
    }
    return null;
  }

  function TVShow(options, location) {
    for (var key in options) {
      if (Object.prototype.hasOwnProperty.call(options, key)) {
        this[key] = options[key];
      }
    }

    this.location = location;

    this.images = {
      folder: image(location, 'folder.jpg'),
      fanart: image(location, 'fanart.jpg')
    };
  }

  TVShow.fromFile = function(nfo, location, resume) {
    fs.readFile(nfo, 'utf8', function(e, contents) {
      if (e) {
        return resume(e);
      }
      var parser = new xml2js.Parser({
        trim: true,
        explicitRoot: false,
        explicitArray: false,
        async: true
      });
      parser.parseString(contents, function(e, result) {
        if (e) {
          return resume(e);
        }
        resume(null, new TVShow(result, location));
      });
    });
  };

  function scan(location, resume) {
    fs.readdir(location, function(e, files) {
      if (e) {
        return resume(e);
      }
      files.forEach(function(file) {
        var absolute = path.join(location, file);
        fs.stat(absolute, function(e, stat) {
          if (e) {
            return resume(e);
          }
          if (stat.isDirectory()) {
            var nfo = path.join(absolute, 'tvshow.nfo');
            fs.exists(nfo, function(exists) {
              if (e) {
                return resume(e);
              }
              if (exists) {
                TVShow.fromFile(nfo, absolute, function(e, show) {
                  resume(e, show);
                });
              }
            });
            scan(absolute, resume);
          }
        });
      });
    });
  }

  app.controller('VideoList', ['$scope', 'locations', function($scope, locations) {
    $scope.shows = [];

    locations.forEach(function(location) {
      scan(location, function(e, show) {
        if (show) {
          $scope.shows.push(show);
          $scope.$digest();
        }
      });
    });
  }]);

})();
