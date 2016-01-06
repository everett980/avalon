app.config(function($stateProvider) {
		$stateProvider.state('questing', {
				url: '/',
				templateUrl: 'browser/html/templates/questingTemplate.html',
				controller: 'QuestingCtrl'
		});
});
