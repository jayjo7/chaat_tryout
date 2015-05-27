//var secret = Meteor.settings.private.stripe.testSecretKey;
var Future = Npm.require('fibers/future');
var Fiber  = Npm.require('fibers');

Meteor.methods({


	stripeAuthAndCharge: function(order)
	{
    var Stripe = Meteor.npmRequire('stripe')(stripePrivateKey(order.orgname));
    Stripe.setApiVersion(stripeApiVersion(order.orgname));

		var currencyCode = orgCurrencyCode(order.orgname);	
		for(var key in order.cardToken)
        {
        	console.log(order.sessionId + " :CardToken: " +key + " = " +order.cardToken[key]);
        }


        console.log(order.sessionId + " :To Payment system: order.Total = "    + order.Total);

        var orderTotalCents = order.Total;

        console.log(order.sessionId + " :To Payment system: orderTotalCents before toFixed(2)= "    	+ orderTotalCents);
        orderTotalCents = Number(orderTotalCents).toFixed(2);
        console.log(order.sessionId + " :To Payment system: orderTotalCents before replace= "    		+ orderTotalCents);
        orderTotalCents     = orderTotalCents.toString().replace('.','');
        console.log(order.sessionId + " :To Payment system: orderTotalCents     = " 	+ orderTotalCents);
        console.log(order.sessionId + " :To Payment system: currencyCode  = " 	+ currencyCode);
        console.log(order.sessionId + " :To Payment system: order.cardToken.id  = "    	+ order.cardToken.id);

        	    //var idempotency_key = sequence._id +":"+sequence.orderNumber;
        	    //console.log(sessionId + " :To Payment system: idempotency_key  = " 		+ idempotency_key);

        var toPaymentDescription 	= "OrderNumber:" + order.OrderNumber;
        console.log(order.sessionId + " :To Payment system: toPaymentDescription  = " + toPaymentDescription);

        var result ={};

       	var stripeCharge = new Future();

		Stripe.charges.create({
  								amount: orderTotalCents,
  								currency: currencyCode,
  								source: order.cardToken.id, // obtained with Stripe.js
  								description: toPaymentDescription,
  								metadata: {'OrderNumber': order.OrderNumber}
							},
							Meteor.bindEnvironment (function(error, charge){

							if(error)
							{
                result.status = STATUS_FAILED;
								result.error= error;

								for(var key in error)
  								{
  									console.log(order.sessionId + " :error object from stripe: " + key + " = " + error[key]);
  			
  								}
  							PaymentInfo.insert({_id:order.UniqueId, orgname:order.orgname,error:error});
								console.log(order.sessionId + " : Done Invoking Stripe - Yes Error");
				

							}
							else
							{
								for(var key in charge)
  								{
  									console.log(order.sessionId + " :charge object from stripe: " + key + " = " + charge[key]);
  			
  								}

								PaymentInfo.insert({_id:order.UniqueId, orgname:order.orgname, charge:charge});
								result.charge = charge;
								console.log(order.sessionId + " : Done Invoking Stripe - No Error");

							}
						stripeCharge.return(result);
				}));

		 return stripeCharge.wait();

	}


});