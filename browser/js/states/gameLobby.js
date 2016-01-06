app.config(function($stateProvider, $locationProvider) {
		$stateProvider.state('gameLobby', {
				url: '/',
				templateUrl: 'browser/html/templates/gameLobbyTemplate.html',
				controller: 'GameLobbyCtrl'
		});
});
