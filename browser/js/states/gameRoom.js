app.config(function($stateProvider, $locationProvider) {
		$stateProvider.state('gameRoom', {
				url: '/',
				templateUrl: 'browser/html/templates/gameRoomTemplate.html',
				controller: 'GameRoomCtrl'
		});
});
