app.factory('VoteQuestPartyFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.getVotingInfo = function() {
				SocketFactory.emit('get vote info', 'useless');
		}
		factory.voteFailed = function() {
				SocketFactory.emit('vote happened', false);
				console.log('front end voted down');
		}
		factory.votePassed = function() {
				SocketFactory.emit('vote happened', true);
				console.log('front end voted up');
		}
		factory.goingBack = function() {
				SocketFactory.emit('going back', 'useless');
		}
		factory.goQuest = function() {
				SocketFactory.emit('go quest', 'useless');
		}
		factory.vote = function(agree, disagree) {
				if(agree) SocketFactory.emit('vote cast', 'agree');
				else SocketFactory.emit('vote cast', 'disagree');
		}	
		return factory;
});
