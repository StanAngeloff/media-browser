angular.module('MediaBrowser.services').service('CrawlerService', [function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),

      Q = require('q'),

      utils = require('utils');

  var readDirectory = Q.nfbind(fs.readdir),
      stat = Q.nfbind(fs.stat);

  var CrawlerService = {};

  function scanFile(file) {
    var deferred = Q.defer();
    stat(file)
      .done(function(stats) {
        if (stats.isDirectory()) {
          scanLocation(file).done(function(files) {
            deferred.resolve(files);
          }, function(e) {
            deferred.reject(e);
          });
        } else {
          deferred.resolve([file]);
        }
      }, function(e) {
        deferred.reject(e);
      });
    return deferred.promise;
  }

  function scanLocation(location) {
    var deferred = Q.defer();
    readDirectory(location).done(function(files) {
      var promises = [];
      files.forEach(function(file) {
        var absolute = path.join(location, file);
        promises.push(scanFile(absolute));
      });
      Q.all(promises).done(function(files) {
        deferred.resolve(files);
      }, function(e) {
        deferred.reject(e);
      });
    }, function(e) {
      deferred.reject(e);
    });
    return deferred.promise;
  }

  CrawlerService.scan = function scan(locations) {
    if ( ! Array.isArray(locations)) {
      locations = [locations];
    }
    var deferred = Q.defer(), promises = [];
    locations.forEach(function(location) {
      promises.push(scanLocation(location));
    });
    Q.all(promises).done(function(files) {
      deferred.resolve(utils.flatten(files));
    }, function(e) {
      deferred.reject(e);
    });
    return deferred.promise;
  };

  return CrawlerService;
}]);
