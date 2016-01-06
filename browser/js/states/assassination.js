app.config(function($stateProvider) {
		$stateProvider.state('assassination', {
				url: '/',
				templateUrl: 'browser/html/templates/assassinationTemplate.html',
				controller: 'AssassinationCtrl'
		});
});
