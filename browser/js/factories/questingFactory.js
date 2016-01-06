app.factory('QuestingFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.getQuestingInfo= function() {
				SocketFactory.emit('get quest info', 'useless');
		}
		factory.questPassed = function() {
				SocketFactory.emit('quest resolved', true);
		}
		factory.questFailed = function() {
				SocketFactory.emit('quest resolved', false);
		}
		factory.goToQuestPropose = function() {
				SocketFactory.emit('going back', 'useless');
		}
		factory.goToLadyPhase = function() {
				SocketFactory.emit('ready for lady phase', 'useless');
		}
		factory.vote = function(agree, disagree) {
				if(agree) SocketFactory.emit('quest card played', 'pass');
				else SocketFactory.emit('quest card played', 'fail');
		}	
		factory.gotToQuestPage = function() {
				SocketFactory.emit('on quest page');
		}
		return factory;
});
