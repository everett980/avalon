app.controller('AssassinationCtrl', function($scope, AssassinationFactory, $state) {
		$scope.kill = function(choice) {
				AssassinationFactory.kill(choice);
		}
		$scope.show = false;
		AssassinationFactory.getAssassinationData();
		$scope.$on('assassination data', function(emit, data) {
				console.log('data:', data);
				$scope.show = data.chosenPlayer === data.clientName;
				$scope.chosenPlayer = data.chosenPlayer;
				$scope.clientName = data.clientName;
				$scope.playerArr = data.playerArr;
				$scope.$digest();
		});
		$scope.$on('kill result', function(emit, success) {
				if(success) alert("Evil wins!");
				else alert("Good wins!");
		});
});
