angular.module('MediaBrowser.services').service('PlayerService', ['configuration', function(configuration) {
  'use strict';

  var gui = require('nw.gui'),
      window = gui.Window.get();

  var childProcess = require('child_process'),
      fs = require('fs'),
      path = require('path');

  var extensions = ['mp4', 'avi'];

  var PlayerService = {};

  PlayerService.playFile = function(model) {
    var playerArguments = Array.prototype.slice.call(configuration.playerCommand),
        playerExecutable = playerArguments.shift();
    var found;
    extensions.forEach(function(extension) {
      if (found) {
        return true;
      }
      var playerFile = path.join(
        path.dirname(model.location),
        path.basename(model.location, '.nfo') + '.' + extension
      );
      if ( ! fs.existsSync(playerFile)) {
        return false;
      }
      playerArguments = playerArguments.map(function(argument) {
        if (argument === '%s') {
          return playerFile;
        }
        return argument;
      });
      if (configuration.restoreOnPlayerClose) {
        window.hide();
      }
      var child = childProcess.spawn(playerExecutable, playerArguments, {
        cwd: model.showLocation,
        detached: true,
        stdio: 'ignore'
      });
      child.on('error', function(e) {
        console.error('"%s %s" failed. %s', playerExecutable, playerArguments.join(' '), e.toString());
      });
      if (configuration.restoreOnPlayerClose) {
        child.on('close', function() {
          window.show();
          window.focus();
        });
      }
      child.unref();
      found = true;
    });
  };

  return PlayerService;
}]);
