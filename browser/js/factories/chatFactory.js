app.factory('ChatFactory', function ($on, $emit, SocketFactory) {
		var factory = {};
		factory.messages = [];
		$on('chat message', function(emitName, message) {
				console.log('from factory: ',message)
				$emit('updateArr', message);
		});
		factory.sendMessage = function(message) {
				console.log('shit happened');
				SocketFactory.emit('chat message', message);
		};
		factory.getAllMessages = function() {
				console.log('getting messages');
			return this.messages;
		}
		return factory;
});
