app.config(function($stateProvider, $locationProvider) {
		$stateProvider.state('teamProposal', {
				url: '/',
				templateUrl: 'browser/html/templates/teamProposalTemplate.html',
				controller: 'TeamProposalCtrl'
		});
});
