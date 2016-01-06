app.controller('LoginCtrl', function($scope, $state, LoginFactory, $on, $emit) {
		console.log('testing3434');
		$scope.logIn = function(username) {
				LoginFactory.logInUser(username);
		}
		$on('unsuccessful log in, username taken', function(emit, emitMessage) {
				$scope.usernameTaken = true;
				$scope.$digest();
		});
		$on('successful log in', function(emit, emitMessage) {
				$state.go('roomSelection');
		});
});
