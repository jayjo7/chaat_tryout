Meteor.publish('menu', function(orgname)
{
	return Menu.find({orgname:orgname});
});	

Meteor.publish('content', function(orgname)
{

	return Content.find({orgname:orgname});

});	

Meteor.publish('settings', function(orgname)
{

	return Settings.find({orgname:orgname});

});	

Meteor.publish('appSettings', function(orgname)
{

	return AppSettings.find({orgname:orgname});

});	
	
Meteor.publish('cartItems', function(sessionId,orgname)
{

	return  CartItems.find({session:sessionId, orgname:orgname});

});	

Meteor.publish('ordereditems', function(UniqueId, orgname)
{
 
	return  OrderedItems.find({UniqueId: UniqueId, orgname:orgname });

});	

Meteor.publish('ordereditemsManagement', function( orgname)
{
 
	return  OrderedItems.find({ orgname:orgname });

});	
	
Meteor.publish('orders', function(UniqueId,orgname)
{

	return Orders.find({UniqueId: UniqueId, orgname:orgname});

});	

Meteor.publish('orderManagement', function(orgname)
{

	return Orders.find({ orgname:orgname});

});	

Meteor.publish('ordersMeta', function(UniqueId,orgname)
{

	return OrdersMeta.find({UniqueId: UniqueId,orgname:orgname });

});	