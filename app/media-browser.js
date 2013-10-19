angular.module('MediaBrowser.controllers', []);
angular.module('MediaBrowser.directives', ['ui.utils']);
angular.module('MediaBrowser.models', []);
angular.module('MediaBrowser.services', ['MediaBrowser.models']);

angular.module('MediaBrowser', [
  'MediaBrowser.controllers',
  'MediaBrowser.directives',
  'MediaBrowser.models',
  'MediaBrowser.services'
]);
