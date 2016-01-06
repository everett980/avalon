app.config(function($stateProvider) {
		$stateProvider.state('voteQuestParty', {
				url: '/',
				templateUrl: 'browser/html/templates/voteQuestPartyTemplate.html',
				controller: 'VoteQuestPartyCtrl'
		});
});
