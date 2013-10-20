angular.module('MediaBrowser.models').factory('ShowModel', function() {
  'use strict';

  var path = require('path'),
      utils = require('utils');

  var nextId = 1;

  function ShowModel(options) {
    utils.extend(this, {
      id: nextId,
      title: null,
      location: null,
      episodes: []
    }, options);

    utils.extend(this, {
      images: {
        folder: path.join(this.location, 'folder.jpg'),
        fanart: path.join(this.location, 'fanart.jpg')
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
