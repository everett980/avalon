app.controller('LadyCtrl', function($scope, LadyFactory, $state) {
		$scope.waitingToContinue = false;
		$scope.canLady = false;
		$scope.ladyCardPlayed = false;
		$scope.iLadyed = false;
		LadyFactory.getLadyInfo();
		$scope.goToQuestPropose = function() {
				$scope.waitingToContinue = true;
				LadyFactory.goToQuestPropose();
		}
		$scope.$on('everyone ready', function(emit, data) {
				$state.go('teamProposal');
		});
		$scope.$on('lady info', function(emit, data) {
				$scope.canLady = data.clientName === data.ladyCardHolder;
				for(var key in data) {
						$scope[key] = data[key];
				}
				$scope.playerArr2 = data.playerArr.filter(function(player) {
						console.log(player, data.clientName, player === data.clientName);
						return player !== data.ladyCardHolder;
				});
				$scope.$digest();
		});
		$scope.$on('lady results', function(emit, data) {
				$scope.wasLadied = data.wasLadied;
				$scope.wasLadiedAllignment = data.allignment;
				$scope.ladyCardPlayed = true;
				$scope.$digest();
		});
		$scope.ladying = function(choice) {
				$scope.iLadyed = true;
				$scope.canLady = false;
				LadyFactory.lady(choice);
		}
});
