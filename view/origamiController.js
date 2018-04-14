angular.module('ori').controller('origamiController', ['$rootScope', '$scope', '$http', '$window','$state','$stateParams' ,'Upload','origamiService','userService','socketService' , function($rootScope,$scope, $http, $window,$state,$stateParams ,Upload, origamiService, userService , socketService ){
 $scope.person = "mara";
 $scope.upload = {};
 $scope.x=0;
$scope.origami=[];
$scope.upload.tags = [];
$scope.origg={}; 
angular.module('ori').filter('trusted', ['$sce', function ($sce) {
    return function (url) {
        return $sce.trustAsResourceUrl(url);
    };
}]);

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

origamiService.getOrigami()
	 .then(function successCallback(res) {
            $scope.origami = res.data;
	    console.log($scope.origami);
            console.log(res.data);
        },
        function errorCallback(res) {
            console.log('Error: ' + res.data);
        });

if($stateParams.origami){
origamiService.getOneOrigami($stateParams.origami)
                 .then(function successCallback(res) {
	    $scope.origg={};
            $scope.origg = res.data;
            $scope.origg.likes= $scope.origg.likes.length;
	    $scope.origg.dislikes= $scope.origg.dislikes.length;
	    console.log($scope.origg);
            console.log(res);
        },
        function errorCallback(res) {
            console.log('Error: ' + res.data);
        });


}

$scope.uploadTag = function(){
  $scope.upload.tags.push($scope.tag);
}
$scope.submit = function(){
console.log($scope);
 Upload.upload({
        url: '/api/origami',
        method: 'post',
        data: $scope.upload,
      }).then(function (response) {
	console.log("yeaaa boyyyyyyy");
        console.log(response.data);
	$("#origami").modal('hide');
	$scope.tag="";
        $scope.upload = {};
      })


}
$scope.sendcomment = function(){
origamiService.postCommentOrigami($stateParams.origami,$scope.upld)
                 .then(function successCallback(res) {
	    $scope.origg = res.data;
	    console.log($scope.origg);
      $state.reload();
console.log(res);
        },
        function errorCallback(res) {
            console.log('Error: ' + res.data);
	 $state.go('account.login');
        });
}
 $scope.removeItem = function(index){
    $scope.upload.tags.splice(index, 1);
  }



$scope.like =  function (data){
console.log(data);
origamiService.updateLikes(data)
                 .then(function successCallback(res) {
            $scope.raspuns = res.data;
		if(res.data=="1"){                
   socketService.emit('addlike',{data: data,user:$rootScope.username});
                console.log( "aici este DOAR like");
	console.log(res);
 }
   else if(res.data=="2"){
socketService.emit('addlike',{data: data,user:$rootScope.username});
                console.log( "aici este like");
  console.log(res);
 
 socketService.emit('addundislike',{data: data,user:$rootScope.username});
                console.log( "aici este undislike");
  console.log(res);
 }

   

	else{ console.log("aici e unlike");
socketService.emit('addunlike', {data: data,user:$rootScope.username});
	   for(var i=0;i<$scope.origami.length;i++){
		if($scope.origami[i]._id==data){
			console.log("am gasti elementul "+i);

}
}

}
},

        function errorCallback(res) {
            console.log('Error: ' + res.data);
		$state.go('account.login');
        });


}
$scope.dislike =  function (data){
console.log(data);
origamiService.updateDislikes(data)
                 .then(function successCallback(res) {
            $scope.raspuns = res.data;
    if(res.data=="4"){                
   socketService.emit('adddislike',{data: data,user:$rootScope.username});
                console.log( "aici este DOAR dislike");
  console.log(res);
 }
   else if(res.data=="5"){
socketService.emit('adddislike',{data: data,user:$rootScope.username});
                console.log( "aici este dislike");
  console.log(res);
 
 socketService.emit('addunlike',{data: data,user:$rootScope.username});
                console.log( "aici este unlike");
  console.log(res);
 }

   

  else{ console.log("aici e undislike");
socketService.emit('addundislike', {data: data,user:$rootScope.username});
     for(var i=0;i<$scope.origami.length;i++){
    if($scope.origami[i]._id==data){
      console.log("am gasti elementul "+i);

}
}

}
},

        function errorCallback(res) {
            console.log('Error: ' + res.data);
		 $state.go('account.login');
        });


}
socketService.on('addlike', function(data) {
console.log(data);
  for(var i=0;i<$scope.origami.length;i++){
                if($scope.origami[i]._id==data.data){
                        console.log("am gasti elementul "+i);
 $scope.origami[i].likes.push(data.username);
 $scope.origg.likes++;
$scope.$applyAsync();
        console.log("Buna lumeee");
    }
}


})
socketService.on('addunlike', function(data) {
console.log(data);
 for(var i=0;i<$scope.origami.length;i++){
                if($scope.origami[i]._id==data.data){
                        console.log("am gasti elementul "+i);
 var index = $scope.origami[i].likes.indexOf(data.username);
	console.log( $scope.origg.likes); 
$scope.origami[i].likes.splice(index, 1);
 $scope.origg.likes--;
$scope.$applyAsync();
    }  


}})
socketService.on('adddislike', function(data) {
console.log(data);
  for(var i=0;i<$scope.origami.length;i++){
                if($scope.origami[i]._id==data.data){
                        console.log("am gasti elementul "+i);
 $scope.origami[i].dislikes.push(data.username);
  $scope.origg.dislikes++;
$scope.$applyAsync();
        console.log("Buna lumeee");
    }

}


})
socketService.on('addundislike', function(data) {
console.log(data);
 for(var i=0;i<$scope.origami.length;i++){
                if($scope.origami[i]._id==data.data){
                        console.log("am gasti elementul "+i);
 var index = $scope.origami[i].dislikes.indexOf(data.username);
 $scope.origami[i].dislikes.splice(index, 1);
  $scope.origg.dislikes--;
$scope.$applyAsync();
    }  

}})




}])


