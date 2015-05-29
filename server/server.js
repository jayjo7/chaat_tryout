Meteor.methods({

	addToCart:function(qty, product, session,Name, Category, Charge, orgname)
	{
		qty = Number (qty);
		if(qty>0)
		{
			var now = Meteor.call('getLocalTime', orgname);

			console.log(session + ' addToCart:now = ' + now);

			var totalCharge = Charge * qty;

			console.log(session + ' addToCart:totalCharge = ' +totalCharge);

		
			CartItems.update({product:product, session:session},{qty:qty, product:product, session:session,Name:Name, Category:Category, Charge:Charge,totalCharge:totalCharge, dateAdded:now, orgname:orgname},{upsert:true});

			console.log('Added the product = ' + product  + ' for session id = ' + session + 'for orgname = ' + orgname);
			
		}
		else if (qty=== 0) 
		{
				console.log('Quantity is Zero');

				CartItems.remove ({product:product, session:session, orgname:orgname}, function(error, result){

					if (error)
					{
						console.log('Trouble removing the product = ' + product  + ' for session id = ' + session);
					}

				});

		}
		else
		{
				console.log('addToCart: Invalid Quantity');

		}
	},
	
	removeCartItem:function(product,sessionId, orgname)
	{
		console.log('Removing from Cart: Sessionid = ' + sessionId + ' :: product' +product);
		CartItems.remove({session:sessionId, product:product, orgname:orgname});
	},

	removeAllCartItem:function(sessionId)
	{
		CartItems.remove({session:sessionId});
	},

	getOrder:function(sessionId, orgname)
	{

		console.log("sessionId = " + sessionId);
		var order = Orders.findOne({UniqueId:sessionId, orgname:orgname});
		console.log("order = " + order);

		return order;
	},

	getNextSequenceValue: function ()
	{
		
		try{

			var currentId = Counters.findOne({},{sort:{orderNumber:-1}}) || 1;

			for(var key in currentId)
			{
			    console.log("getNextSequenceValue: currentId: " + key + " = " + currentId[key]);
			}

        	var nextOrderumber= Number (currentId.orderNumber) + 1;
        	Counters.insert({orderNumber:nextOrderumber});
        	console.log("getNextSequenceValue: nextOrderumber: " + nextOrderumber);

        	var sequence = Counters.findOne({orderNumber:nextOrderumber});
        	for(var key in sequence)
        	{
        		console.log("getNextSequenceValue: sequence: " + key + " = " +sequence[key]);
        	}

        	return sequence;

        }catch(error)
        {
        			console.log(error);
        }
   	
	},

	updateOrderStatus: function(sessionId, orgname, UniqueId, statusCode)
	{


	},

	orderItems:function(sessionId, contactInfo, sequence, orgname, cardToken, callback)
	{

			console.log(sessionId + ' :In OrderItems');
			console.log(sessionId + ' :orgname = ' + orgname);


			for(var key in sequence)
        	{
        		console.log(sessionId + " :sequence: " +key + " = " +sequence[key]);
        	}

			var order 				= {};
			order.orgname     		= orgname;
			order.sessionId 		= sessionId;
			order.Status 			= STATE_ONE;
			order.StatusCode		= STATE_CODE_ONE;
			order.OrderNumber 		= sequence.orderNumber;
			order.UniqueId 			= sequence._id;
			order.TimeOrderReceived = Meteor.call('getLocalTime', orgname );
			order.CustomerName 		= contactInfo.contactName;
			order.CustomerPhone 	= contactInfo.phoneNumber;
			order.CustomerEmail 	= contactInfo.email;
			order.MessageToKitchen 	= contactInfo.messageToKitchen;

			var itemString='';
			var items=[];

			var itemsInCart= CartItems.find({session:sessionId, orgname:orgname});

			console.log(sessionId + ' :Number of items in cart for session ' + sessionId
				+ ', contact  ' + order.CustomerPhone + ' ' +order.CustomerEmail +' = ' + itemsInCart.count());

			var totalItemCount = 0;
			var subTotal = 0;

			itemsInCart.forEach (function (cartitems)
			{
				totalItemCount += Number(cartitems.qty);

				for(key in cartitems)
				{
					console.log(sessionId + " :cartitems: " + key + "  =  " + cartitems[key]);
				}


				subTotal +=  (Number(cartitems.Charge) * cartitems.qty);
				itemString = itemString + cartitems.qty + " - " + cartitems.Name +'\n';
   				items.push(
   				{ 
        				"name" : cartitems.Name,
        				"qty"  : cartitems.qty
				});

				cartitems.UniqueId = order.UniqueId;

				try{

					OrderedItems.update({product:cartitems.product, _id:cartitems._id, orgname:orgname},cartitems,{upsert:true});
				}catch (exception)
				{
					console.log(sessionId + ' :exception on OrderedItems Update = ' + exception);
					throw exception;

				}


   			});

			console.log(sessionId + " :Done with Calculating " );



			order.itemsObject 		= items;
			order.Items 			= itemString.substring(0, itemString.length-1); // Substring to get rid of the last new character
			order.TotalItem 		= totalItemCount;	
			order.SubTotal 			= Number (subTotal.toFixed(2));


			var tax 				= Meteor.call('getSetting', 'tax', orgname);
			var sale_discount 		= Meteor.call('getSetting', 'sale_discount', orgname);

            var taxValue 			= Number(tax);
            var sale_discountValue 	= Number(sale_discount);
            order.taxValue      	= taxValue;
            order.saleDiscountValue = sale_discountValue;            
            console.log(sessionId + ' :tax = ' + taxValue );
            console.log(sessionId + ' :discount = ' + sale_discountValue );



            if(sale_discountValue > 0 && taxValue > 0)
            {
                order.discount               = order.SubTotal * sale_discountValue;
                order.subtotalAfterDiscount  = order.SubTotal - order.discount;
                order.tax                    = order.subtotalAfterDiscount  * taxValue;
                order.Total                  = Number((order.subtotalAfterDiscount + order.tax).toFixed(2));
            }
            else
            if (sale_discountValue > 0 && taxValue <= 0)

            {
                order.discount               = order.SubTotal * sale_discountValue;
                order.subtotalAfterDiscount  = order.SubTotal - order.discount;
                order.Total                  = Number((order.subtotalAfterDiscount).toFixed(2));

            }
            else
            if (sale_discountValue <=  0 && taxValue > 0)
            {
                 order.tax 		= order.subtotal * taxValue;
                 order.total 	= Number((order.subtotal + order.tax).toFixed(2));


            } 
            else
            {
               order.total = Number((order.subtotal ).toFixed(2));

            }


			if(cardToken)
			{
				order.Payment='Online';
				order.cardToken = cardToken;
            }
            else
            {

            	order.Payment='At Pickup';

            }	

            console.log(sessionId + " : Here is the completed Order Object" + JSON.stringify(order, null, 4));

            try{

			   	Orders.insert(order);
			   	console.log(sessionId + " :Order insert complete" );

			   	OrdersMeta.insert(order, function(error, doc){
			   		if(error)
			   		{
			   			console.log(sessionId + " : Error inserting OrdersMet : "  + error);

			   		}
			   		else
			   		{
			   			console.log(sessionId + " : Done with inserting OrdersMeta")
			   		}

			   	});
			   	console.log(sessionId + " :OrdersMeta insert complete" );

			}catch(e)
			{
				console.log(sessionId + " :trouble insert the order ["+ order.OrderNumber + "] to mongodb " + order);
				throw new Meteor.Error(e);

			}
			try{

			 	CartItems.remove({session:sessionId, orgname:orgname});
			 	console.log(sessionId + " :CartItems remove complete" );


			}catch(e)
			{
				config.log(sessionId + " : trouble removing the items from CartItems collection; orderNumber ["+ order.OrderNumber + "]" );
				
			}

		return order;

	
	}
});


OrdersMeta.after.insert(function (userId, doc) {

  	console.log(doc.sessionId + ": In the OrdersMeta Insert Hook");

  	var processStatus	= 	{
  								'payment'	:{},
  						   		'websheets'	:{},
  						   		'email'		:{},
  						   		'sms'		:{}

  							};

  	var payment 		= 	{};
  	var emailCustomer 	=	{};
  	var emailClient 	=	{};
  	var emailWebmaster 	= 	{};
  	var smsCustomer		= 	{};
  	var smsClient		= 	{};
  	var smsWebmaster	= 	{};					

  	//Start CC Auth and Charge
 	if(doc.cardToken)
 	{	
 		processStatus.payment.status = STATUS_ENABLED;

 		if( isPaymentStripe(doc.orgname))
 		{   
 			payment.vendor  = 'Stripe';
	 		payment.status 	= STATUS_SUCCESS;
	 		var result;
	 		try{
	 			console.log(doc.sessionId + ": Start charging the card");
				var result = Meteor.call('stripeAuthAndCharge', doc);

			}catch(e)
			{
				console.log(doc.sessionId + ": Card Authorization and charge process exprienced fatal error");
				console.log(doc.sessionId + ": Error: " + e);
				PaymentInfo.insert({_id:doc.UniqueId, error:e});
				result.error = e;
			}

			if( result.error)
			{
				doc.Payment='Charge Failed';
				var orderStatusAlertMessage = Meteor.call('getSetting', 'order_status_alert_message', doc.orgname);
				Orders.update({UniqueId:doc.UniqueId}, {$set: {Payment: doc.Payment, orderStatusAlert:orderStatusAlertMessage}});
				OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {Payment: doc.Payment, orderStatusAlert:orderStatusAlertMessage}});
				console.log(doc.sessionId + ": Jay:Todo:Send appropriate notifciation to customer and owner");
				payment.status 	= STATUS_FAILED;
				payment.error 	= result.error;
				var response = Meteor.call('sendCCAuthFailedNotification', doc);
				payment.declineNotification = new Object();;
				for(var key in response)
				{
					 payment.declineNotification[key] = response[key];
				}

			}
		}
		else
		{
			console.log(doc.sessionId + ": Client is configured for online payment, but no Payment processor enabled - Fatal");
			processStatus.payment.status 	= STATUS_FATAL;
			processStatus.payment.error 	= 'Client is configured for online payment, but no Payment processor enabled - Fatal';
		}

		processStatus.payment.payment = payment;

 	}
 	else
 	{
 		console.log(doc.sessionId + ': Either payment is not enabled or customer opt not to pay online')
 		processStatus.payment.status 	=	STATUS_NOT_ENABLED;
 	}
 	console.log(doc.sessionId + ": Done payment process" );
 	//End CC Auth and Charge


    //Start Sending the Websheets
	try{
	  		var count = 0;
	  		processStatus.websheets.status 	= STATUS_SUCCESS;
	  		var response;
	  		do
	  		{
	  			count +=1;
	  			response = Meteor.call('postWebsheets', doc);
	  			console.log(doc.sessionId + ": attempted count = " + count );
	  		}while (count < WEBSHEETS_MAX_RETRY && response.statusCode !== 200)

	  		if(response.statusCode !== 200)
	  		{
	  			console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
	  			processStatus.websheets.status 	= STATUS_FAILED;
	  		}
	  		else
	  		{
	  			processStatus.websheets.response  = response ;
	  			Orders.update({UniqueId:doc.UniqueId},     {$set: {sheetRowId : response.data.sheetRowId}});
				OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {sheetRowId : response.data.sheetRowId}});
	  		}
	 }catch(e)
	 {
	  		console.log(doc.sessionId + ": Caught error on posting to websheets fatal error.", e);
	  		console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
	  		processStatus.websheets.status 	= STATUS_FATAL;
	  		processStatus.websheets.error 	= e.toString();

	 }
	 console.log(doc.sessionId + ': Done posting to websheets');
	 //End Sending the Websheets

	 //Start Sending Email
 	if(isEmailEnabled(doc.orgname))
 	{
 		processStatus.email.status = STATUS_ENABLED;

 		if(isEmailMailgun(doc.orgname))
 		{
		 		//Customer Email
			 	if(doc.CustomerEmail)
			 	{

			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, CUSTOMER);
					    console.log(JSON.stringify(response, null, 4));

					 	for(var key in response)
					 	{
					 		emailCustomer [key] = response[key];
					 	}

					 	if(response.result.error)
            			{
            				emailCustomer.status 	= STATUS_FAILED;
                            emailCustomer.error 	= response.result.error.statusCode;
            			}


					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailCustomer.status 	= STATUS_FATAL;
						emailCustomer.error 	= e.toString();
						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': customer opt not receive email')
			 		emailCustomer.status 	=	STATUS_NOT_ENABLED;

			 	}

			 	processStatus.email.emailCustomer = emailCustomer;

			 	//Client Email
			 	if(isClientEmailOrderReceived(doc.orgname))
			 	{

			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, CLIENT);
					 	for(var key in response)
					 	{
					 		emailClient [key] = response[key];
					 	}
					 	if(response.result.error)
            			{
            				emailClient.status 	= STATUS_FAILED;
                            emailClient.error 	= response.result.error.statusCode;
            			}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailClient.status 	= STATUS_FATAL;
						emailClient.error 	= e.toString();
						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': Not configured to send email to the client')
					emailClient.status 	=	STATUS_NOT_ENABLED;	 	
				}

			 	processStatus.email.emailClient = emailClient;

			 	//Webmaster Email
			 	if(isEmailWebmaster(doc.orgname))
			 	{
			 		try{
					 	var response = Meteor.call('emailOrderReceived', doc, WEBMASTER);
					 	for(var key in response)
					 	{
					 		emailWebmaster [key] = response[key];
					 	}
					 	if(response.result.error)
            			{
            				emailWebmaster.status 	= STATUS_FAILED;
                            emailWebmaster.error 	= response.result.error.statusCode;
            			}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending email: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						emailWebmaster.status 	= STATUS_FATAL;
						emailWebmaster.error 	= e.toString();
						
					}

			 	}
			 	else
			 	{
			 		console.log(doc.sessionId + ': Not configured to send email to the Webmaster')
			 		emailWebmaster.status 	=	STATUS_NOT_ENABLED;	
			 	}	
			 	processStatus.email.emailWebmaster = emailWebmaster;
	 	}
	 	else
	 	{
	 		console.log(doc.sessionId + ": Client is configured for sending email, but no vendor api enabled - Fatal");
			processStatus.email.status 	= STATUS_FATAL;
			processStatus.email.error 	= 'Client is configured for sending email, but no vendor api enabled - Fatal'

	 	}
	}
	else
	{
	 	console.log(doc.sessionId + ': Email is not enabled for this client')
 		processStatus.email.status 	=	STATUS_NOT_ENABLED;

	}

 	console.log(doc.sessionId + ": Done sending initial order email");
	//Ens Sending the Email

	//Start Sending the SMS
	if(isSmsEnabled(doc.orgname))
	{
		if (isSmsTwilio(doc.orgname))
		{
				if(doc.CustomerPhone)
				{
					try{
					 	var response = Meteor.call('smsOrderReceived', doc, doc.CustomerPhone);
					 	for(var key in response.result)
					 	{
					 		console.log(key + ' = ' + response.result[key]);
					 		smsCustomer[key] = response.result[key];
					 	}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending sms to customer: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						smsCustomer.status 	= STATUS_FATAL;
						smsCustomer.error 	= e.toString();
						
					}

				}
				else
				{
					console.log(doc.sessionId + ': customer opt not receive sms')
			 		smsCustomer.status 	=	STATUS_NOT_ENABLED;	

				}
				processStatus.sms.smsCustomer = smsCustomer;


				if(isSmsClient(doc.orgname))
				{
					var clientPhoneNumberText = Meteor.call('getSetting', 'phone_number_texting', doc.orgname);
					try{
					 	var response = Meteor.call('smsOrderReceived', doc, clientPhoneNumberText, 'client');
					 	for(var key in response.result)
					 	{
					 		console.log(key + ' = ' + response.result[key]);
					 		smsClient[key] = response.result[key];
					 	}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending sms to Client: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						smsClient.status 	= STATUS_FATAL;
						smsClient.error 	= e.toString();
						
					}					

				}
				else
				{
					console.log(doc.sessionId + ': Not configured to send sms to the client')
					smsClient.status 	=	STATUS_NOT_ENABLED;	 	
					
				}

				processStatus.sms.smsClient = smsClient;

				if(isSmsWebmaster(doc.orgname))
				{

					try{
					 	var response = Meteor.call('smsOrderReceived', doc, webmasterPhoneNumberText(doc.orgname),WEBMASTER);
					 	for(var key in response.result)
					 	{
					 		console.log(key + ' = ' + response.result[key]);
					 		smsWebmaster[key] = response.result[key];
					 	}

					}catch (e)
					{
						console.log(doc.sessionId + " :trouble sending sms to Webmaster: " + e);
						console.log(doc.sessionId + ": Jay Todo: Send Email Notification to Webmaster and Owner");
						smsWebmaster.status 	= STATUS_FATAL;
						smsWebmaster.error 	= e.toString();
						
					}					

				}
				else
				{
					console.log(doc.sessionId + ': Not configured to send email to the Webmaster')
					smsWebmaster.status 	=	STATUS_NOT_ENABLED;	 	
					
				}
				processStatus.sms.smsWebmaster = smsWebmaster;
		}
		else
		{

			console.log(doc.sessionId + ": Client is configured for sending sms, but no vendor api enabled - Fatal");
			processStatus.sms.status 	= STATUS_FATAL;
			processStatus.sms.error 	= 'Client is configured for sending sms, but no vendor api enabled - Fatal'

		}

	}
	else
	{
		console.log(doc.sessionId + ': SMS is not enabled for this client')
 		processStatus.sms.status 	=	STATUS_NOT_ENABLED;
	}

 	console.log(doc.sessionId + ": Done sending inital order sms");	
	//End Sending the SMS


 	//Jay:TODO: Examine the processStatus object and handle it appropriately,

 	console.log(doc.sessionId + ': Process Status' +  JSON.stringify(processStatus, null, 4))
 	OrdersMeta.update({UniqueId:doc.UniqueId}, {$set: {processStatus: processStatus}});




});

