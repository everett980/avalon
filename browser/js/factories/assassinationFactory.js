app.factory('AssassinationFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.getAssassinationData = function() {
				SocketFactory.emit('get assassination info', 'useless');
		}
		factory.kill = function(choice) {
				SocketFactory.emit('kill', choice);
		};
		return factory;
});
