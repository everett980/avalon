app.controller('VoteQuestPartyCtrl', function($scope, VoteQuestPartyFactory, $on, $state) {
		$scope.waitingForNextState = false;
		VoteQuestPartyFactory.getVotingInfo();
		$scope.showForm = true;
		$scope.waitingOnResults = true;
		$scope.allVoted = false;
		$scope.vote = function(agree, disagree) {
				if(!agree) agree = false;
				if(!disagree) disagree == false;
				if(agree === disagree) {
						alert("You have to check exactly one option.");
						return;
				}
				VoteQuestPartyFactory.vote(agree, disagree);
				$scope.showForm = false;
		}
		$on('vote data', function(emit, roomObj) {
			for(var key in roomObj) {
				$scope[key] = roomObj[key];
			}
			$scope.notYetVoted = roomObj['playerArr'];
			$scope.$digest;
		});		
		$on('someone voted', function(emit, name) {
				$scope.notYetVoted = $scope.notYetVoted.filter(function(player) { return player !== name } );
				$scope.$digest();
		});
		$on('everyone voted', function(emit, data) {
				$scope.waitingOnResults = false;
				$scope.allVoted = true;
				var passes = 0;	
				var tempString = "";
				data.forEach(function(playerVote) {
						tempString+=Object.keys(playerVote)[0]+": "+playerVote[Object.keys(playerVote)[0]]+"\n";
						if(playerVote[Object.keys(playerVote)[0]] === 'agree') passes++;
				});
				if(passes > $scope['playerArr'].length / 2) {
						tempString += "The vote passes. "+$scope.questPartyArg.join(', ')+" will go on a quest!";
						VoteQuestPartyFactory.votePassed();
						$scope.passed = true;
				} else {
						tempString += "The vote fails, time to propose a new group of people."
						VoteQuestPartyFactory.voteFailed();
						$scope.passed = false;
				}
				$scope.results = tempString;
				$scope.$digest();
		});
		$on('everyone ready', function(emit, data) {
				$state.go('teamProposal');
		});
		$scope.goToQuesting = function() {
				$scope.waitingForNextState = true;
				VoteQuestPartyFactory.goQuest();
		}
		$on('everyone go quest', function(emit, data) {
				$state.go('questing');
		});
		$scope.goBackToQuestProposal = function() {
				VoteQuestPartyFactory.goingBack();
				$scope.waitingForNextState = true;
				// $state.go('teamProposal');
		}
});
