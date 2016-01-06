app.factory('SocketFactory', function($on, $emit, $rootScope) {
		var socket = io.connect();
		var factory = {};
		factory.emit = function(emitName, emitMessage) {
				socket.emit(emitName, emitMessage);
		}
		socket.on('middleWareHandlePls', function(emitArr) {
				console.log('middle ware is handling!', emitArr);
				$rootScope.$broadcast(emitArr[0], emitArr[1]);
		})
		return factory;
});
