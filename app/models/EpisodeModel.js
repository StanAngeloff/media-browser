angular.module('MediaBrowser.models').factory('EpisodeModel', function() {
  'use strict';

  var utils = require('utils');

  function EpisodeModel(options) {
    utils.extend(this, options);
  }

  return EpisodeModel;
});

