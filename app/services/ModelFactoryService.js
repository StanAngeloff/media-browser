angular.module('MediaBrowser.services').service('ModelFactoryService', ['$injector', function($injector) {
  'use strict';

  var fs = require('fs'),

      Q = require('q'),
      xml2js = require('xml2js'),

      utils = require('utils');

  var xmlParser = new xml2js.Parser({
    trim: true,
    explicitRoot: false,
    explicitArray: false,
    async: true
  });

  var readFile = Q.nfbind(fs.readFile),
      xmlParseString = Q.nbind(xmlParser.parseString, xmlParser);

  var ModelFactoryService = {};

  function parseXmlFile(file) {
    var deferred = Q.defer();
    readFile(file, 'utf8').done(function(contents) {
      xmlParseString(contents).done(function(document) {
        deferred.resolve(document);
      }, function(e) {
        deferred.reject(e);
      });
    }, function(e) {
      deferred.reject(e);
    });
    return deferred.promise;
  }

  ModelFactoryService.fromXmlFile = function fromXmlFile(model, file, options) {
    var deferred = Q.defer();
    parseXmlFile(file).done(function(document) {
      var instance = new ($injector.get(model))(utils.extend(document, options));
      deferred.resolve(instance);
    }, function(e) {
      deferred.reject(e);
    });
    return deferred.promise;
  };

  return ModelFactoryService;
}]);
