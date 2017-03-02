(function () {
  angular
    .module('app')
    .directive('player', player);

  function mediaPlayer () {
    return {
      restrict: 'EA',
      templateUrl: '../partials/player.html',
      controller: 'mediaPlayerController'
    };
  }

})();
