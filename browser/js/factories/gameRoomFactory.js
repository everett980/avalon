app.factory('GameRoomFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.setUpRoom = function() {
				SocketFactory.emit('set up room', 'useless');
		}
		factory.startGame = function() {
				SocketFactory.emit('start game', 'useless');
		}
		factory.tellServerMeReady = function() {
				console.log('telling server i am ready');
				SocketFactory.emit('player ready', 'useless');
		}
		return factory;
});
