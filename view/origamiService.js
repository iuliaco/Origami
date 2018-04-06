angular.module("ori").factory('origamiService', ["$http", function($http) {

  return {
getOrigami:function(){
configObject={
      method: 'GET',
      url: '/api/origami'
     }
        return $http(configObject);
},
updateLikes:function(data){
configObject={
      method: 'POST',
      url: '/api/like/'+data,
     }
        return $http(configObject);
},
updateDislikes:function(data){
configObject={
      method: 'POST',
      url: '/api/dislike/'+data,
     }
        return $http(configObject);
},
getOneOrigami:function(data){
configObject={
      method: 'GET',
      url: '/api/origami/'+data
}
      return $http(configObject);
 },
postCommentOrigami:function(data,body){
configObject={
      method: 'PUT',
      url: '/api/origami/'+data,
      data: body
}
      return $http(configObject);
 },


}
}])
