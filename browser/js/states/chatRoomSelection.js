app.config(function($stateProvider, $locationProvider) {
//		$locationProvider.html5Mode(true);
		$stateProvider.state('roomSelection', {
				url: '/',
				templateUrl: 'browser/html/templates/chatRoomSelectionTemplate.html',
				controller: 'ChatRoomSelectionCtrl'
		});
});
