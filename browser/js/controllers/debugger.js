app.controller('debugger', function($scope, $state, SocketFactory, DebuggerFactory, $on, $emit) {
		var connections;
		$scope.getConnections = function() {
				SocketFactory.emit('get connections', 'not important');
		}
		$scope.testRoom = function() {
				console.log(connections);
				console.log(Object.keys(connections));
				if(Object.keys(connections).length === 5) {
						DebuggerFactory.testRoom();
				} else {
						console.log(Object.keys(connections).length);
				}
		}
		$on('here are connections', function(notImportant, connectionObj) {
				connections = connectionObj;	
				console.dir(connectionObj);
		});
		$on('test room ready', function(useless, useless) {
				$state.go('gameRoom');
		});
});
