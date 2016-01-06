app.factory('ChatRoomSelectionFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.join = function(roomName) {
				SocketFactory.emit('join room', roomName);
		}
		factory.addRoom = function(roomObj) {
				console.log(roomObj);
						var charsInRoom = [];
						if(roomObj['Percival']) charsInRoom.push('Percival');
						if(roomObj['Merlin']) charsInRoom.push('Merlin');
						if(roomObj['Mordred']) charsInRoom.push('Mordred');
						if(roomObj['Morgana']) charsInRoom.push('Morgana');
						if(roomObj['Oberon']) charsInRoom.push('Oberon');
						for(var i = 0; i<roomObj['numRegGood']; i++) charsInRoom.push('Loyal Servent of Arthur');
						for(var i = 0; i<roomObj['numRegBad']; i++) charsInRoom.push('Minion of Mordred');
						roomObj['characterArr'] = charsInRoom;
						console.log(charsInRoom.length);
						if(!roomObj['lady']) roomObj['lady'] = false;
						roomObj['playerArr'] = [];
				console.log(roomObj);
				SocketFactory.emit('add room', roomObj);
		}
		factory.getAllRooms = function() {
				SocketFactory.emit('get rooms', 'not important');
		}
		return factory;
});
