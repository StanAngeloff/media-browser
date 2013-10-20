angular.module('MediaBrowser.common', []);
angular.module('MediaBrowser.controllers', []);
angular.module('MediaBrowser.directives', ['ui.utils']);
angular.module('MediaBrowser.filters', []);
angular.module('MediaBrowser.models', []);
angular.module('MediaBrowser.services', ['MediaBrowser.models']);

angular.module('MediaBrowser', [
  'MediaBrowser.common',
  'MediaBrowser.controllers',
  'MediaBrowser.directives',
  'MediaBrowser.filters',
  'MediaBrowser.models',
  'MediaBrowser.services'
]);
