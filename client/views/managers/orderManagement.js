Template.orderManagement.events({
    'click #moveOrderStatus': function(evt,tmpl)
    {
    	event.preventDefault();
    	console.log('moveOrderStatus:In moveOrderStatus event');
    	console.log('moveOrderStatus: evt = ' + JSON.stringify(this, null, 4));
    	var sessionId = Session.get('appUUID');
    	toStatusCode = this.StatusCode + 1;
    	Meteor.call('updateOrderStatus', sessionId, this.orgname, this.OrderNumber, this.UniqueId, toStatusCode)

    }
});