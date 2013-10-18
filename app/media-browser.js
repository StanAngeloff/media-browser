/*global $, angular */

(function() {
  'use strict';

  var fs = require('fs'),
      path = require('path');

  var xml2js = require('xml2js');

  var app = angular.module('MediaBrowser', ['ui.utils']);

  var $window = $(window),
      $document = $(document),
      $body = $(document.body);

  app.value('locations', ['/home/stan/Videos']);

  function image() {
    var absolute = path.join.apply(path, arguments);
    if (fs.existsSync(absolute)) {
      return absolute;
    }
    return null;
  }

  function parseFile(file, resume) {
    fs.readFile(file, 'utf8', function(e, contents) {
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
        resume(null, result);
      });
    });
  }

  function extend() {
    var result = arguments[0] || {};
    for (var i = 1, length = arguments.length; i < length; i = i + 1) {
      if ( ! arguments[i]) {
        continue;
      }
      for (var key in arguments[i]) {
        if (Object.prototype.hasOwnProperty.call(arguments[i], key)) {
          result[key] = arguments[i][key];
        }
      }
    }
    return result;
  }

  var TV = { };

  TV.Show = function TVShow(options) {
    extend(this, options);
    extend(this, {
      episodes: [],
      images: {
        folder: image(this.location, 'folder.jpg'),
        fanart: image(this.location, 'fanart.jpg')
      }
    });
  };

  TV.Episode = function TVEpisode(options) {
    extend(this, options);
  };

  function fromFile(type) {
    return function(file, options, resume) {
      if (typeof resume === 'undefined') {
        resume = options;
        options = null;
      }
      parseFile(file, function(e, xml) {
        if (e) {
          return resume(e);
        }
        resume(null, new TV[type](extend({}, xml, options)));
      });
    };
  }

  TV.Show.fromFile = fromFile('Show');
  TV.Episode.fromFile = fromFile('Episode');

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
          resume(null, absolute, stat);
          if (stat.isDirectory()) {
            scan(absolute, resume);
          }
        });
      });
    });
  }

  function scanShows(location, resume) {
    scan(location, function(e, file) {
      if (e) {
        return resume(e);
      }
      if (/tvshow\.nfo$/.test(file)) {
        var location = path.dirname(file);
        TV.Show.fromFile(file, { location: location }, function(e, tvShow) {
          if (e) {
            return resume(e);
          }
          resume(null, tvShow);
          scan(location, function(e, file) {
            if (e) {
              return resume(e);
            }
            var basename = path.basename(file);
            if (basename.indexOf(tvShow.title) === 0 && /\.nfo$/.test(file)) {
              TV.Episode.fromFile(file, function(e, tvEpisode) {
                if (e) {
                  return resume(e);
                }
                tvShow.episodes.push(tvEpisode);
                resume(null, tvEpisode);
              });
            }
          });
        });
      }
    });
  }

  app.controller('VideoList', ['$scope', '$timeout', 'locations', function($scope, $timeout, locations) {

    $scope.shows = [];
    $scope.selectedShowIndex = 0;

    var scrollQ;
    $scope.$watch('selectedShowIndex', function() {
      if (scrollQ) {
        $timeout.cancel(scrollQ);
      }
      scrollQ = $timeout(function() {
        scrollQ = null;

        var $element = $('#shows .selected');
        if ( ! $element.length) {
          return false;
        }

        var viewportWidth = $window.width(),
            viewportHeight = $window.height(),
            elementWidth = $element.width(),
            elementHeight = $element.height(),
            elementOffset = $element.offset();

        $body.stop().animate({
          scrollTop: (elementOffset.top + (elementHeight / 2) - (viewportHeight / 2)),
          scrollLeft: (elementOffset.left + (elementWidth / 2) - (viewportWidth / 2))
        }, 175);

      }, 1000 / 60, false);
    });

    $scope.selectNextShow = function($event) {
      $event.preventDefault();
      $scope.selectedShowIndex = Math.min($scope.selectedShowIndex + 1, $scope.shows.length - 1);
    };

    $scope.selectPreviousShow = function($event) {
      $event.preventDefault();
      $scope.selectedShowIndex = Math.max(0, $scope.selectedShowIndex - 1);
    };

    var digestQ;
    function digest(timeout) {
      if (digestQ) {
        $timeout.cancel(digestQ);
      }
      digestQ = $timeout(function() {
        digestQ = null;
        $scope.$digest();
      }, timeout, false);
    }

    locations.forEach(function(location) {
      scanShows(location, function(e, entity) {
        if (e) {
          throw e;
        }
        if (entity instanceof TV.Show) {
          $scope.shows.push(entity);
        }
        digest(125);
      });
    });
  }]);

})();
