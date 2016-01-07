app.config(function($stateProvider) {
		$stateProvider.state('lady', {
				url: '/',
				templateUrl: 'browser/html/templates/ladyTemplate.html',
				controller: 'LadyCtrl'
		});
});
