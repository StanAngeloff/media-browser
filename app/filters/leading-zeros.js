angular.module('MediaBrowser.filters', []).filter('leadingZeros', function () {
  'use strict';

  return function (n, length) {
    n = parseInt('' + n, 10);
    length = parseInt('' + length, 10);
    if (isNaN(n) || isNaN(length)) {
      return n;
    }
    n = '' + n;
    while (n.length < length) {
      n = '0' + n;
    }
    return n;
  };
});
