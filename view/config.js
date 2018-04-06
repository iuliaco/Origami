angular.module('ori')
  .config(function($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise('/contacts');
    $stateProvider.state('contacts', {
        url: '/contacts',
        templateUrl: '/view/partial1.html',
        controller: 'origamiController'
      })
      .state('account', {
        url: '/account',
        abstract: true,
        templateUrl: '/view/parent.html',
        controller: function($scope) {
          $scope.title = 'poza';
        }
      })
      .state('account.login', {
        url: '/login',
        template: '<log></log>',
        controller:  'userController'

        
      })
      .state('account.register', {
        url: '/register',
        template: '<register></register>',
        controller:  'userController'

      })
      .state('acasa', {
        url: '/acasa',
        templateUrl: '/view/acasa.html',
        controller: 'origamiController'
      })
	.state('origami', {
        url: '/origami/:origami',
        templateUrl: '/view/origami.html',
        controller: 'origamiController'
      })

      .state('profile', {
        url: '/profile/:username',
        templateUrl: '/view/profile.html',
        controller:  'userController'
      });
  })
   .run(function( $rootScope, $location, $cookies, $http) {

if($cookies.get('connect.sid')){
$rootScope.logat=1;
 console.log($rootScope.usrname);

console.log($rootScope.logat);

console.log($rootScope.username);

}
 else{$rootScope.logat=0;}  ;




   });

