/*global angular */

(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path');

  var app = angular.module('MediaBrowser', []);

  app.value('locations', ['/home/stan/Videos']);

  function TVShow(name, location) {
    this.name = name;
    this.location = location;
  }

  TVShow.fromFile = function(nfo, location, resume) {
    resume(null, new TVShow('BOB', location));
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
    locations.forEach(function(location) {
      scan(location, function(e, show) {
        console.log(e, show);
      });
    });
  }]);

})();
