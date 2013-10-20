angular.module('MediaBrowser.models').factory('EpisodeModel', function() {
  'use strict';

  var utils = require('utils');

  var nextId = 1;

  function EpisodeModel(options) {
    utils.extend(this, {
      id: nextId,
      title: null,
      location: null,
      showLocation: null
    }, options);

    nextId = nextId + 1;
  }

  return EpisodeModel;
});

