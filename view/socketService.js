'use strict'
angular.module('ori').factory('socketService', ['$rootScope', function($rootScope) {
  var socket = io.connect();

  return {
    on: function(eventName, callback){
        console.log("De cate ori ma transmit?");
	console.log(socket.id);
 socket.on(eventName, callback);
    
},
    emit: function(eventName, data) {
 console.log("De cate ori ma transmit?");
      socket.emit(eventName, data);

    }
  };
}]);
