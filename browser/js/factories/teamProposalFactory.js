app.factory('TeamProposalFactory', function(SocketFactory, $on, $emit) {
		var factory = {};
		factory.getInfoForQuestToPropose = function() {
			SocketFactory.emit('get info for quest to propose', 'useless');
		}	
		factory.propose = function(questPartyArg) {
				SocketFactory.emit('propose quest party', questPartyArg);
		}
		factory.readyForProposal = function() {
				SocketFactory.emit('one ready for proposal', 'useless');
		}
		return factory;
});
