app.factory('GameLobbyFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.getRoomData = function() {
				SocketFactory.emit('get room data', 'not important');
		}
		return factory;
});
