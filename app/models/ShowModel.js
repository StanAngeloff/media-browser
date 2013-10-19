angular.module('MediaBrowser.models').factory('ShowModel', function() {
  'use strict';

  var fs = require('fs'),
      path = require('path'),
      utils = require('utils');

  var nextId = 1;

  function getImageLocation() {
    var absolute = path.join.apply(path, arguments);
    if (fs.existsSync(absolute)) {
      return absolute;
    }
    return null;
  }

  function ShowModel(options) {
    utils.extend(this, {
      id: nextId,
      title: null,
      location: null,
      episodes: []
    }, options);

    utils.extend(this, {
      images: {
        folder: getImageLocation(this.location || '', 'folder.jpg'),
        fanart: getImageLocation(this.location || '', 'fanart.jpg')
      }
    });

    nextId = nextId + 1;
  }

  ShowModel.prototype.isEpisodeFile = function(file) {
    var basename = path.basename(file);
    return (file.indexOf(this.location) === 0 && basename.indexOf(this.title) === 0 && /\.nfo$/.test(file));
  };

  return ShowModel;
});
