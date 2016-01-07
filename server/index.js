var express= require('express')
var app = express();
var path = require('path');

var http = require('http').Server(app);
var io = require('socket.io')(http);

// app.use('/socketConfig.js', express.static(__dirname+'/socketConfig.js'));
app.use('/public', express.static(path.normalize(__dirname+'/../public')));
app.use('/node_modules', express.static(path.normalize(__dirname+'/../node_modules')));
app.use('/browser', express.static(path.normalize(__dirname+'/../browser')));


//Keep track of names of sockets:

var connections = {};
function getByName(name) {
		var result;
		for(var key in connections) {
				if(connections[key]['name'] === name) result = key;
		}
		return result;
}
function getByChar(character, room) {
		var result = [];
		for(var key in connections) {
				if(connections[key]['character'] === character && connections[key]['roomName'] === room) result.push(connections[key]['name']);
		}
		return result;
}
var rooms = [];
var quests = {
		5 : [2,3,2,3,3],
		6 : [2,3,4,3,4],
		7 : [2,3,3,4,4],
		8 : [3,4,4,5,5],
		9 : [3,4,4,5,5],
		10: [3,4,4,5,5]
}
//games with 7+ players require 4th quest to have two failures to count as failed quest

//Rest of app

app.get('/', function(req, res, next) {
		res.sendFile(path.normalize(__dirname+'/../browser/html/index.html'));
});


io.on('connection', function(socket) {
		connections[socket.id] = {name: null};
		console.log(connections);
		console.log('a user connected');
		socket.on('disconnect', function() {
				delete connections[socket.id];
				console.log('a user disconnected');
		});
		socket.on('chat message', function(message) {
				console.log(message);
				if(connections[socket.id].name) {
						io.emit('middleWareHandlePls', ['chat message', connections[socket.id].name + ": " + message]);
				}
		});
		socket.on('user logged in', function(username) {
				var taken = false;
				for(var data in connections) {
						console.log(data, connections[data]);
						if(connections[data].name === username) taken = true;
				}
				if(taken) {
						socket.emit('middleWareHandlePls', ['unsuccessful log in, username taken', username]);
				} 
				else {
						connections[socket.id] = {name: username};
						socket.emit('middleWareHandlePls', ['successful log in', username]);
				}
		console.log(connections);
		});

		socket.on('get connections', function(data) {
				socket.emit('middleWareHandlePls', ['here are connections', connections]);
		});
		socket.on('get rooms', function(data) {
				socket.emit('middleWareHandlePls', ['here are rooms', rooms]);
		});
		socket.on('add room', function(roomObj) {
				var taken = false;
				for(var room in rooms) {
						if(!rooms[room]['name'].localeCompare(roomObj['name'])) {
								taken = true;
								console.log('setting taken to true');
						}
				}
				if(taken) {
						socket.emit('middleWareHandlePls', ['unsuccessful room creation, room name taken', roomObj['name']])
				}
				else {
						roomObj['creator']=connections[socket.id].name;
						if(roomObj['characterArr'].length < 5 || roomObj['characterArr'].length > 10) {
								console.log("Wrong number of characters: ", roomObj['characterArr'].length);
								socket.emit('middleWareHandlePls', ['unsuccessful room creation, you need between 6 and 10 characters in a room', roomObj['characterArr'].length]);
						} else {	
								roomObj['playerArr'].push(connections[socket.id].name);
								rooms.push(roomObj);
								socket.broadcast.emit('middleWareHandlePls', ['new room', roomObj]);
								connections[socket.id]['roomName'] = roomObj['name'];
								socket.emit('middleWareHandlePls', ['go to room lobby', roomObj['name']]);
						}
				}
		});
		socket.on('do testing', function() {
				connections[socket.id]['name'] = 'testRoomMaker';
				roomObj = {'characterArr' : ['Loyal Servent of Arthur', 'Loyal Servent of Arthur', 'Loyal Servent of Arthur', 'Merlin', 'Minion of Mordred'], 'lady' : true, 'playerArr': [], 'creator': connections[socket.id]['name'], 'name' : 'testing', 'playersReady': 0};
				testName='e';
				for(var key in connections) {
						connections[key]['roomName'] = roomObj['name'];
						if(!connections[key]['name']) { connections[key]['name'] = testName; testName+='e' }
						roomObj['playerArr'].push(connections[key]['name']);
				}
				rooms.push(roomObj);
				console.log(rooms);
				for(var key in connections) {
						console.log('emitting to '+connections[socket.id]['name']+' to send them to testing');
						io.to(key).emit('middleWareHandlePls', ['test room ready', roomObj['name']]);
				}
		});




		socket.on('get room data', function(useless) {
				var match = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				socket.emit('middleWareHandlePls', ['room data', match]);
		});
		socket.on('join room', function(roomName) {
				var match = rooms.filter(function(room) {
						return room['name'].localeCompare(roomName) === 0;
				})[0];
				console.log(match);
				if(match['characterArr'].length > match['playerArr'].length) {
						match['playerArr'].push(connections[socket.id]['name']);
						connections[socket.id]['roomName'] = match['name'];
						socket.broadcast.emit('middleWareHandlePls', ['here are rooms', rooms]);
						socket.emit('middleWareHandlePls', ['go to room lobby', match['name']]);
						for(var key in connections) {
								if(!match['name'].localeCompare(connections[key]['roomName'])) {
										io.to(key).emit('middleWareHandlePls', ['someone joined this room', connections[socket.id]['name']]);
								}
						}
						//io.to(socket.id).emit('middleWareHandlePls
				} else {
						socket.emit('middleWareHandlePls', ['room full', match['name']]);
				}
		});
						socket.on('set up room', function(uselessData) {
								var room = rooms.filter(function(room) {
										return room['name'] === connections[socket.id]['roomName'];
								})[0];
								console.log('found room: ', room);
								if(!room['creator'].localeCompare(connections[socket.id]['name'])) {
										console.log('found creator: ', room['creator']);
										var charCopy = [];
										var playerCopy = [];
										while(room['characterArr'].length) {
												charCopy.push(room['characterArr'].splice(Math.floor(Math.random() * room['characterArr'].length), 1)[0]);
										};
										while(room['playerArr'].length) {
												playerCopy.push(room['playerArr'].splice(Math.floor(Math.random() * room['playerArr'].length), 1)[0]);
										};
										room['playerArr'] = playerCopy;
										room['characterArr'] = charCopy;
										room['playerArr'].forEach(function(playerName, i) {
												connections[getByName(playerName)]['character'] = room['characterArr'][i];
										});
										for(var key in connections) {
												if(room['playerArr'].indexOf(connections[key]['name']) >= 0) {
														console.log('emitting to '+connections[key]['name']+' to tell him that he is '+connections[key]['character']);
														infoObj = {character: connections[key]['character'], info: 'nothing.'};
														connections[key]['info'] = 'nothing';
														if(infoObj['character'] === "Merlin") {
																info = getByChar('Morgana', room['name']);
																info = info.concat(getByChar('Oberon', room['name']));
																info = info.concat(getByChar('Minion of Mordred', room['name']));
																info2 = [];
																while(info.length) {
																		info2.push(info.splice(Math.floor(Math.random() * info.length), 1)[0]);
																}
																info = info2;
																info = info.join(', ') + " are bad.";
																infoObj['info'] = info;
																connections[key]['info'] = info;
														}
														if(infoObj['character'] === 'Percival') {
																info = getByChar('Merlin', room['name']);
																info = info.concat(getByChar('Morgana', room['name']));
																info2 = [];
																while(info.length) {
																		info2.push(info.splice(Math.floor(Math.random() * info.length), 1)[0]);
																}
																info = info2;
																if(info.length) {
																		info = 'out of '+info.join(' and ') + " one is Morgana, one is Merlin, but which is which?";
																		infoObj['info'] = info;
																		connections[key]['info'] = info;
																}
														}
														if(infoObj['character'] === 'Mordred') {
																info = getByChar('Morgana', room['name']);
																info = info.concat(getByChar('Minion of Mordred', room['name']));
																info2 = [];
																while(info.length) {
																		info2.push(info.splice(Math.floor(Math.random() * info.length), 1)[0]);
																}
																info = info2;
																if(info.length) {
																		info = info.join(', ') + " are your fellow evil doers.";
																		infoObj['info'] = info;
																		connections[key]['info'] = info;
																}
														}
														if(infoObj['character'] === 'Morgana') {
																info = getByChar('Mordred', room['name']);
																info = info.concat(getByChar('Minion of Mordred', room['name']));
																info2 = [];
																while(info.length) {
																		info2.push(info.splice(Math.floor(Math.random() * info.length), 1)[0]);
																}
																info = info2;
																if(info.length) {
																		info = info.join(', ') + " are your fellow evil doers.";
																		infoObj['info'] = info;
																		connections[key]['info'] = info;
																}
														}
														if(infoObj['character'] === 'Minion of Mordred') {
																info = getByChar('Mordred', room['name']);
																info = info.concat(getByChar('Morgana', room['name']));
																info = info.concat(getByChar('Minion of Mordred', room['name']));
																info2 = [];
																while(info.length) {
																		info2.push(info.splice(Math.floor(Math.random() * info.length), 1)[0]);
																}
																info = info2;
																info = info.filter(function(name) {
																		return name !== connections[socket.id]['name']
																});
																if(info.length) {
																		info = info.join(', ') + " are your fellow evil doers.";
																		infoObj['info'] = info;
																		connections[key]['info'] = info;
																}
														}
														infoObj['areLeader'] = connections[key]['name'] === room['creator'];
														io.to(key).emit('middleWareHandlePls', ['roles assigned', infoObj]);
												}
										}
								}
						});
						socket.on('player ready', function(data) {
								var room = rooms.filter(function(room) {
										return room['name'] === connections[socket.id]['roomName'];
								})[0];
								room['playersReady'] = room['playersReady'] + 1;
								if(room['playersReady'] === room['playerArr'].length) {
										for(var key in connections) {
												if(connections[key]['roomName'] === room['name'])
								io.to(key).emit('middleWareHandlePls', ['all players ready', room['name']]);
										}
										room['playersReady'] = 0;
								} else {
										console.log('counting ready players: ', room['playersReady']);
								}
						});
						socket.on('start game', function(data) {
								var room = rooms.filter(function(room) {
										return room['name'] === connections[socket.id]['roomName'];
								})[0];
								room['playersPerQuest'] = quests[room['playerArr'].length];
								room['currentLeaderIndex'] = 0;
								room['ladyCardHolder'] = room['playerArr'][room['playerArr'].length - 1];
								//set below to [] after testing
								room['questsCompleted'] = [];
				room['questsRejected'] = 0;
				room['playersReady'] = 0;
				var roomThatIsStarting = connections[socket.id]['roomName'];
				for(var key in connections) {
						if(connections[key]['roomName'] === roomThatIsStarting) io.to(key).emit('middleWareHandlePls', ['game start', 'useless'])
				}
		});
		socket.on('get info for quest to propose', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var dataObj = {};
				for(var key in room) {
						dataObj[key] = room[key];
				}
				dataObj['questProposer'] = room['playerArr'][room['currentLeaderIndex'] % room['playerArr'].length];
				dataObj['nameOfClient'] = connections[socket.id]['name'];
				socket.emit('middleWareHandlePls', ['info for quest to propose', dataObj]);
		});
		socket.on('propose quest party', function(questPartyArg) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['questPartyArg'] = questPartyArg;
				for(var key in connections) {
						if(connections[key]['roomName'] === room['name']) io.to(key).emit('middleWareHandlePls', ['vote on quest', 'useless']);
				}
				room['questPartyVotes'] = [];
				room['currentLeaderIndex'] = room['currentLeaderIndex'] + 1;
		});
		socket.on('get vote info', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['questResult'] = [];
				socket.emit('middleWareHandlePls', ['vote data', room]);
		});
		socket.on('vote cast', function(vote) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var key = connections[socket.id]['name'];
				var obj = {};
				obj[key] = vote;
				room['questPartyVotes'].push(obj);
				for(var key in connections) {
						if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['someone voted', connections[socket.id]['name']]);
				}
				if(room['questPartyVotes'].length === room['playerArr'].length) {
						console.log(room['questPartyVotes']);
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone voted', room['questPartyVotes']])
						}
				}
		});
		socket.on('vote happened', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				if(room['creator'] === connections[socket.id]['name']) {
						if(!data) {
								room['questsRejected'] = room['questsRejected'] + 1;
								console.log('quest did not happen');
						} else {
								room['questsRejected'] = 0;
								console.log('quest happened!');
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('going back', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone ready', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('go quest', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone go quest', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('get quest info', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var dataObj = {};
				for(var key in room) {
						dataObj[key] = room[key];
				}
				dataObj['clientName'] = connections[socket.id]['name'];
				socket.emit('middleWareHandlePls', ['quest data', dataObj]);
		});
		socket.on('on quest page', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['ready to vote', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('quest card played', function(vote) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var key = connections[socket.id]['name'];
				var obj = {};
				obj[key] = vote;
				room['questResult'].push(obj);
				for(var key in connections) {
						if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['one quester voted', connections[socket.id]['name']]);
				}
				if(room['questResult'].length === room['playersPerQuest'][room['questsCompleted'].length]) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['questers voted', room['questResult']])
						}
				}
		});
		socket.on('quest resolved', function(pass) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				if(room['creator'] === connections[socket.id]['name']) {
						if(pass) {
								room['questsCompleted'].push('Pass');
								//delete the other two pushes!
								//room['questsCompleted'].push('Pass');
								//room['questsCompleted'].push('Pass');
						}
						else room['questsCompleted'].push('Fail');
						console.log(room['questsCompleted']);
						var passes = 0;
						var fails = 0;
						room['questsCompleted'].forEach(function(result) {
								if(result === 'Fail') fails++;
								else passes++;
						});
						if(passes >= 3) {
								for(var key in connections) {
										if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['good wins', room['characterArr'].indexOf('Merlin') >= 0])
								}
						}
						if(fails >= 3) {
								for(var key in connections) {
										if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['evil wins', 'useless'])
								}
						}
				}
		});
		socket.on('ready for quest propose', function (data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone ready for team proposal', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});		
		socket.on('ready for lady phase', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone ready for lady phase', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('one ready for proposal', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['playersReady'] = room['playersReady'] + 1;
				if(room['playersReady'] === room['playerArr'].length) {
						for(var key in connections) {
								if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['everyone ready for proposal phase', 'ready'])
						}
						room['playersReady'] = 0;
				}
		});
		socket.on('get assassination info', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var chosenPlayer = getByChar('Minion of Mordred', room['name'])[0];
				for(var key in connections) {
						var dataObj = {};
						dataObj['chosenPlayer'] = chosenPlayer;
						dataObj['clientName'] = connections[key]['name'];
						dataObj['playerArr'] = room['playerArr'];
						if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['assassination data', dataObj])
				}
		});
		socket.on('kill', function(choice) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var chosenPlayer = getByChar('Merlin', room['name'])[0];
				for(var key in connections) {
						if(connections[key]['roomName'] === connections[socket.id]['roomName']) io.to(key).emit('middleWareHandlePls', ['kill result', chosenPlayer === choice])
				}
		});
		socket.on('get lady info', function(data) {
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				var dataObj = {};
				dataObj.ladyCardHolder= room['ladyCardHolder'];
				dataObj.playerArr = room['playerArr'];
				dataObj.questsCompleted = room['questsCompleted'];
				dataObj.currentLeaderIndex = room['currentLeaderIndex'];
				dataObj.playersPerQuest = room['playersPerQuest'];
				dataObj.questsRejected = room['questsRejected'];
				dataObj.clientName = connections[socket.id]['name'];
				socket.emit('middleWareHandlePls', ['lady info', dataObj]);
		});
		socket.on('lady card played', function(choice) {
				var roleOfChoice = connections[getByName(choice)]['character'];
				for(var key in connections) {
					if(connections[key]['roomName'] === connections[socket.id]['roomName'] && connections[key]['name'] !== connections[socket.id]['name']) {
						io.to(key).emit('middleWareHandlePls', ['lady results', {wasLadied: choice, allignment: null}]);
					}
				}
				var allignment = 'evil';
				if(roleOfChoice === 'Loyal Servent of Arthur' || roleOfChoice === 'Percival' || roleOfChoice === 'Merlin') allignment = 'good';
				socket.emit('middleWareHandlePls', ['lady results', {wasLadied: choice, allignment: allignment}]);
				var room = rooms.filter(function(room) {
						return room['name'] === connections[socket.id]['roomName'];
				})[0];
				room['ladyCardHolder'] = choice;
		});	
});

http.listen(3000, function() {
		console.log('listening on port 3000');
});

