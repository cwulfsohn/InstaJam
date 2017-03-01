(function () {
  angular
    .module('app')
    .directive('navigation', navigation);

  function navigation () {
    return {
      restrict: 'EA',
      templateUrl: '../partials/navigation.html',
      controller: 'navController'
    };
  }

})();
