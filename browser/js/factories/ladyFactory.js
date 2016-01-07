app.factory('LadyFactory', function(SocketFactory) {
		var factory = {};
		factory.lady = function(choice) {
				SocketFactory.emit('lady card played', choice);
		}
		factory.getLadyInfo = function() {
				SocketFactory.emit('get lady info', 'useless');
		}
		factory.goToQuestPropose = function() {
				SocketFactory.emit('going back', 'useless');
		}
		return factory;
});
