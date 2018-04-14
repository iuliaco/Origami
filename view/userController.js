angular.module('ori').controller('userController', ['$rootScope', '$scope', '$http', '$window','$state','$stateParams','Upload','userService' , function($rootScope,$scope, $http, $window,$state,$stateParams,Upload , userService ) {
 $scope.person = "mara";
 $scope.user = {};
 $scope.eroare="";
 $scope.eroare2="";

$scope.maxDate = new Date('1/1/2012');
console.log($scope.maxDate);
 userService.getUsername()
        .then(function successCallback(res) {
            $rootScope.username= res.data;
            console.log($rootScope.username);
                return $rootScope.username;
 console.log($rootScope.usrname);

},
        function errorCallback(res) {
           return $rootScope.username= 'Error: ' + res.data;
        });

if($stateParams.username){
userService.getProfile($stateParams.username)
		 .then(function successCallback(res) {
            $scope.profile = res.data;
            console.log($scope.profile);
            console.log(res);
        },
        function errorCallback(res) {
            console.log('Error: ' + res.data);
        });


}


    $scope.authenticate = function(){
	console.log('am ajuns pana aici')
userService.authenticate($scope.user)
		.then(function successCallback(response) {
                    if (response.status==200) {
                        console.log('Registration successful', true);
       
			 console.log('Login successful');
                        console.log(response);
                        $rootScope.username=response.data;
                        console.log( $rootScope.username );
                        $state.go('profile' , {username:$rootScope.username});
                        console.log($stateParams);


                 $state.go('profile({username:$scope.user.logemail})');
} },
   
			function errorCallback(response)  {
                        console.log(response);
				$scope.eroare2="Numele de utilizator/parola/emailul au fost folosite deja";
                    }
                );};

  $scope.login = function(){
        console.log('am ajuns pana aici')
		userService.login($scope.user)
                .then(function successCallback(response) {
                    if (response.status==200) {
                        console.log('Login successful');
			console.log(response);
				$rootScope.username=response.data;
                        console.log( $rootScope.username );
			$state.go('profile' , {username:$rootScope.username});
			console.log($stateParams);

                    }},
			function errorCallback(response) {
                        console.log(response.data);
			console.log(response);
			$scope.eroare=response.data;
                    }
                );};


  $scope.deletelogin = function(){
userService.deleteUser()
 .then(function successCallback(res) {
 $state.go('contacts');
        },
        function errorCallback(res) {
            console.log('Error: ' + res.data);
        });};



 $scope.submit = function(){
      $scope.submit = function(){
		console.log("ma trimit wait a lil");
      Upload.upload({
        url: '/api/login',
        method: 'put',
        data: $scope.upload
      }).then(function (response) {
        console.log(response.data);
$("#Profil").modal('hide');      
  $scope.upload.pull(response.data);
        $scope.upload = {};
      })
  }};
  }])
