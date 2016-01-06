app.factory('SocketFactory', function($on, $emit) {
		var socket = io.connect();
		var factory = {};
		factory.emit = function(emitName, emitMessage) {
				socket.emit(emitName, emitMessage);
		}
		socket.on('middleWareHandlePls', function(emitArr) {
				console.log('middle ware is handling!', emitArr);
				$emit(emitArr[0], emitArr[1]);
		})
		return factory;
});
