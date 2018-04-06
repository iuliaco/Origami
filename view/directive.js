angular.module('ori')
  .directive('navbar', function() {
    return {
      restrict: 'E',
      templateUrl: '/view/navbar.html'
    };
  })
  .directive('log', function() {
    return {
      restrict: 'E',
      templateUrl: '/view/log.html'
    };
  })
.directive('profile', function() {
  return {
    restrict: 'E',
    templateUrl: '/view/profile.html'
  };
})
  .directive('register', function() {
    return {
      restrict: 'E',
      templateUrl: '/view/forminreg.html'
    };
  })
