app.factory('DebuggerFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.testRoom = function() {
				SocketFactory.emit('do testing');
		}
		return factory;
});
