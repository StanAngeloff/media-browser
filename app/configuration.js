angular.module('MediaBrowser')
  .value('configuration', {
    mediaLocations: '/home/stan/Videos',
    playerCommand: ['/usr/bin/smplayer', '-minigui', '-close-at-end', '-fullscreen', '%s']
  });
