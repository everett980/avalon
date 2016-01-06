app.controller('TeamProposalCtrl', function($scope, TeamProposalFactory, $on, $state) {
		$scope.playersReady = false;
		TeamProposalFactory.getInfoForQuestToPropose();
		$on('info for quest to propose', function(emit, roomObj) {
				for(var key in roomObj) {
						$scope[key] = roomObj[key];
				}
				if(roomObj['questsRejected'] >= 4) {
					alert("Too many quests have been rejected, evil has won!");
					roomObj['questsRejected'] = 0;
				}
				$scope.$digest();
				/* $scope.peoplePerQuest = data.peoplePerQuest;
				$scope.questProposer = data.questProposer;
				$scope.nameOfClient = data.nameOfClient;
				$scope.playerArr = data.playerArr;
				$scope.questsRejected = data.questsRejected;
				$scope.questsCompleted = data.questsCompleted; */
		});
		$on('vote on quest', function(emit, data) {
				$state.go('voteQuestParty');
		});
		$on('everyone ready', function(emit, data) {
				$scope.playersReady = true;
				console.log('about to digest');
				$scope.$digest();
		});
		/* $on('everyone ready for proposal phase', function(emit data) {
				TeamProposalFactory.getInfoForQuestToPropose(); */
		$scope.proposeTeam = function() {
				console.log(arguments);
				var reducedArgs = Array.prototype.filter.call(arguments, function(arg) {return arg;});
				var noRepeatArgs = [];
				reducedArgs.forEach(function(arg) {
						if(noRepeatArgs.indexOf(arg) < 0) {
								noRepeatArgs.push(arg);
						}
				});
				if(noRepeatArgs.length === $scope.playersPerQuest[$scope.questsCompleted.length]) {
						TeamProposalFactory.propose(noRepeatArgs);
				} else {
						alert("The team you proposed is invalid!");
				}
		}
});
