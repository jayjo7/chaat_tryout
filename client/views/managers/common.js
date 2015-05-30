Template.registerHelper('newOrderCount', function()
{
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	return  Orders.find({orgname:orgname, StatusCode: 1}).count();

});

Template.registerHelper('getOrders', function(StatusCode)
{
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	console.log('getOrders:StatusCode = ' +StatusCode);
	return  Orders.find({orgname:orgname,StatusCode: StatusCode});

});


Template.registerHelper('getSettings', function(key)
{
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	//console.log('getSettings:key = ' + key)
	var result = Settings.findOne({$and : [{Key: key}, {orgname:orgname},{Value : {"$exists" : true, "$ne" : ""}}]});
		//console.log('getSettings:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getSettingsArray', function(key)
{
	//console.log('getSettingsArray:key = ' + key)
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	var Settings = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})



				//console.log('getSettingsArray = ' + Settings);


				var settingsValue = Settings['Value'];
				//console.log('getSettingsArray:settingsValue= ' + settingsValue);

				var settingsArray = settingsValue.split('\n\n' );

				return settingsArray;
});

Template.registerHelper('getSettingsMulti', function(key)
{
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	//console.log('getSettingsMulti:key = ' + key)
	var result = Settings.find({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]},{sort:{sheetRowId: 1}});
		//console.log('getSettingsMulti:Value = ' + result.Value)

	return result
});


Template.registerHelper('getContent', function(key)
{
	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	//console.log('getContent:key = ' + key)
	var result = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
		//console.log('getContent:Value = ' + result.Value)

	return result.Value
});

Template.registerHelper('getContentArray', function(key)
{
		var orgname = Session.get(ORG_NAME_SESSION_KEY);

	//console.log('getContentArray:key = ' + key)

		var content = Content.findOne({$and : [{Key: key}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})



				//console.log('getContentArray = ' + content);


				var contentValue = content['Value'];
				//console.log('getContentArray:ContentValue= ' + contentValue);

				var contentArray = contentValue.split('\n\n' );

				return contentArray;
});

Template.registerHelper('showCart', function()
{

	    	var  sessid = Session.get('appUUID');
            var orgname = Session.get(ORG_NAME_SESSION_KEY);

            //console.log("shopCart:sessid =  " +sessid);

			var cartItems = CartItems.find({session: sessid, orgname:orgname});
		    cartItems.itemCount = cartItems.count();
		    //console.log("showCart:cartItems.itemCount =  " +cartItems.itemCount);
		    if(cartItems.itemCount > 0)
		    {
		    	return true;
		    }
		    else
		    {
		    	return false;
		    }


});

Template.registerHelper('isMenuAvailable', function(categoryMenu)
{
	    var orgname = Session.get(ORG_NAME_SESSION_KEY);

        //console.log('isMenuAvailable:categoryMenu = ' + categoryMenu)
		var menuCount = Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]}).count();
		if(menuCount > 0)
			return true;
		else
			return false;

});

Template.registerHelper('menuMulti', function(categoryMenu)
{
	    var orgname = Session.get(ORG_NAME_SESSION_KEY);


		return Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]});

});


Template.registerHelper('currency', function(num)
{

        return '$' + Number(num).toFixed(2);

});

Template.registerHelper('isToSell', function(fontStyle)
{

         if('italic' === fontStyle)
            return false;
        else
            return true;

});

Template.registerHelper('isItemAvailable', function(fontLine)
{
		if('line-through' === fontLine)
			return  false;
		else
			return true;

});

Template.registerHelper('isSpecial', function(fontWeight)
{
        if('bold' === fontWeight)
            return true;
        else
            return false;

});

Template.registerHelper('soldOut', function(fontLine)
{
    	if('line-through' === fontLine)
    		return 'soldout';
    	else
    		return '';

});

Template.registerHelper('isPaymentEnabled', function(){

	    var orgname = Session.get(ORG_NAME_SESSION_KEY);

	    console.log('Meteor.settings.public[orgname].onlinePayment = ' + Meteor.settings.public[orgname].onlinePayment);

	    if('enabled' === Meteor.settings.public[orgname].onlinePayment)
	    {
	    	return true;
	    }
	    else
	    {
	    	false;
	    }


});

Template.registerHelper('imageFormatter', function(){

	var orgname = Session.get(ORG_NAME_SESSION_KEY);

	return Meteor.settings.public[orgname].imageFormatter;

});


validData = function(input)
{
	console.log("validData:input = " + input);

	if(input)
	{
		return true;
	}
	else
	{
		return false;
	}

}

isPaymentStripe	 = function(orgname) 
{
    if('STRIPE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

isPaymentSquare	 = function(orgname) 
{
    if('SQUARE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

isPaymentBrainTree	 = function(orgname) 
{
    if('BRAINTREE' === Meteor.settings.public[orgname].paymentProcessor.toUpperCase())
    {
        return true;
    }
    else
    {
        return false;
    }
}

gmtOffset  	= function(orgname)
{
    return  Meteor.settings.public[orgname]. gmtOffset;
}

countryCode =  function(orgname)
{
	return  Meteor.settings.public[orgname]. countryCode;
}


