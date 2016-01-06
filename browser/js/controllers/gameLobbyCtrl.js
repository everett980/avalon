app.controller('GameLobbyCtrl', function($scope, GameLobbyFactory, $on, $state) {
		GameLobbyFactory.getRoomData();
		$on('room data', function(emit, data) {
				$scope.playersInRoom = data.playerArr;
				$scope.charsInGame = data.characterArr;
				if(data.characterArr.length !== data.playerArr.length) $scope.$digest();
				else $state.go('gameRoom');
		});
		$on('someone joined this room', function(emit, data) {
				GameLobbyFactory.getRoomData();
		});
});
