angular.module('app').factory('playerFactory', function($document) {
  var audio = $document[0].createElement('audio');
  return audio;
});
