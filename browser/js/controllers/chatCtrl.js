app.controller('ChatCtrl', function($scope, ChatFactory, $on, $emit) {
		$scope.sendMessage = function(message) {
				$scope.textEntry = '';	
				ChatFactory.sendMessage(message);
		}
		$on('updateArr', function(myEvent, msg) {
				console.log('got a message: ', msg);
				$scope.messageArr.push(msg);
				$scope.$digest();
		})
		$scope.messageArr = [];
		$scope.getAllMessages = function(param) {
				return ChatFactory.getAllMessages(param);
		}
});
