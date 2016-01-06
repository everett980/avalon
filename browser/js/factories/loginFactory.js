app.factory('LoginFactory', function($on, $emit, SocketFactory) {
		var factory = {};
		factory.logInUser = function(username) {
			SocketFactory.emit('user logged in', username);
		};
		return factory;
});
