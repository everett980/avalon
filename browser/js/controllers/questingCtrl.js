app.controller('QuestingCtrl', function($scope, QuestingFactory, $state) {
		$scope.waitingForNextState = false;
		QuestingFactory.getQuestingInfo();
		QuestingFactory.gotToQuestPage();
		$scope.showForm = false;
		$scope.waitingOnResults = true;
		$scope.allVoted = false;
		var evilWon = false;
		$scope.passFail = function(agree, disagree) {
				if(!agree) agree = false;
				if(!disagree) disagree == false;
				if(agree === disagree) {
						alert("You have to check exactly one option.");
						return;
				}
				QuestingFactory.vote(agree, disagree);
				$scope.showForm = false;
		}
		$scope.$on('ready to vote', function(emit, data) {
				$scope.showForm = true;
				$scope.$digest();
		});
		$scope.$on('quest data', function(emit, roomObj) {
			for(var key in roomObj) {
				$scope[key] = roomObj[key];
			}
			$scope.notYetVoted = [];
			$scope.questPartyArg.forEach(function(partyMember) {
					$scope.notYetVoted.push(partyMember);
			});
			console.log($scope.notYetVoted);
			$scope.$digest;
		});		
		$scope.$on('one quester voted', function(emit, name) {
				$scope.notYetVoted = $scope.notYetVoted.filter(function(player) { return player !== name } );
				$scope.$digest();
		});
		$scope.$on('questers voted', function(emit, data) {
				$scope.waitingOnResults = false;
				$scope.allVoted = true;
				var passes = 0;	
				var fails = 0;
				var tempString = "";
				data.forEach(function(playerVote) {
						if(playerVote[Object.keys(playerVote)[0]] === 'fail') fails++;
						else passes++;
				});
				var failsToFailQuest = 1;
				if($scope.questsCompleted.length === 3 && $scope.playerArr.length >= 7) failsToFailQuest = 2;
				if(fails < failsToFailQuest) {
						tempString += "The vote passes. There were "+passes+" passes and "+fails+" fails.";
						QuestingFactory.questPassed();
						$scope.passed = true;
				} else {
						tempString += "The vote passes. There were "+passes+" passes and "+fails+" fails.";
						QuestingFactory.questFailed();
						$scope.passed = false;
				}
				$scope.results = tempString;
				$scope.$digest();
		});
		$scope.$on('everyone ready for lady', function(emit, data) {
				$state.go('lady');
		});
		$scope.$on('everyone ready', function(emit, data) {
				$state.go('teamProposal');
		});
		$scope.$on('evil wins', function(emit, data) {
			if(!evilWon) alert('Evil won');
			evilWon = true;
		});
		$scope.$on('good wins', function(emit, data) {
				if(!data) alert('Good won');
				else {
						alert('Good won! Unless..... can the agents of evil assassinate Merlin?');
						$state.go('assassination');
				}
		});
		$scope.goToQuestPropose = function() {
				$scope.waitingForNextState = true;
				QuestingFactory.goToQuestPropose();
		}
		$scope.goToLadyPhase = function() {
				$scope.waitingForNextState = true;
				QuestingFactory.goToLadyState();
		}
});
