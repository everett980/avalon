app.controller('GameRoomCtrl', function($scope, GameRoomFactory, $on, $state) {
		console.log('made it');
//		fire that player read
//		on(five players ready {
		GameRoomFactory.tellServerMeReady();
		$on('all players ready', function(useless, useless) {
				GameRoomFactory.setUpRoom();
		});

		$scope.rolesAssigned = false;
		$on('roles assigned', function(emit, data) {
				alert('got role of '+data.character);
				console.log('logging in there', data);
				$scope.rolesAssigned = true;
				$scope.character = data.character;
				$scope.info = data.info;
				$scope.areLeader = data.areLeader;
				$scope.$digest();
		});			   	
		$on('game start', function(emit, data) {
				$state.go('teamProposal');
		});
		$scope.startGame = function() {
				GameRoomFactory.startGame();
		}
		console.log('testing222');
});
