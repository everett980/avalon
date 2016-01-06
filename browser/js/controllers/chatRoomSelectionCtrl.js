app.controller('ChatRoomSelectionCtrl', function($scope, ChatRoomSelectionFactory, $on, $state) {
		$scope.roomArr = [];
		ChatRoomSelectionFactory.getAllRooms();
		$scope.showForm = false;
		$on('new room', function(emit, roomObj) {
				$scope.roomArr.push(roomObj);
				console.log('got a room object from the server');
				console.dir(roomObj);
				$scope.$digest();
		});
		$on('here are rooms', function(emit, roomArr) {
				console.dir(roomArr);
				$scope.roomArr = roomArr;
				$scope.$digest();
		});
		$on('unsuccessful room creation, room name taken', function(emit, name) {
				alert(name+" is taken!");
		});
		$on('unsuccessful room creation, you need between 6 and 10 characters in a room', function(emit, numChars) {
				alert("You can only have between 6 and 10 characters in a game, you are trying to create a game with "+numChars+" characters!");
		});
		$on('go to room lobby', function(emit, roomName) {
				$state.go('gameLobby');
		});
		$on('room full', function(emit, roomName) {
				alert(roomName+" is full!");
		});
		$scope.joinRoom = function(roomName) {
				console.log('Joining: ', roomName);
				ChatRoomSelectionFactory.join(roomName);
		}
		$scope.addRoom = function(roomName, numRegGood, numRegBad, percival, merlin, mordred, morgana, oberon, lady) {
				var newRoomObj = {name: roomName, numRegGood: numRegGood, numRegBad: numRegBad, Percival: percival, Merlin: merlin, Mordred: mordred, Morgana: morgana, Oberon: oberon, lady: lady};
				ChatRoomSelectionFactory.addRoom(newRoomObj);
		}
		$scope.toggleAddRoomForm = function() {
				console.log($scope.roomArr);
				$scope.showForm = !$scope.showForm;
		}
});
