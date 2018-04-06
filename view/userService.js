
angular.module("ori").factory('userService', ["$http", function($http) {

  return {
authenticate:function(data){
configObject={
      method: 'POST',
      url: '/api/register',
      data: data
     }
        return $http(configObject);
},
 login:function(data){
configObject={
      method: 'POST',
      url: '/api/login',
      data: data
     }
      return $http(configObject);
 },
getUsername:function(){
configObject={
      method: 'GET',
      url: '/api/login'
     }
      return $http(configObject);
 },

getProfile:function(data){
configObject={
      method: 'GET',
      url: '/api/users/'+data
}
      return $http(configObject);
 },



} }]);

