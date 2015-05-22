//var secret = Meteor.settings.private.stripe.testSecretKey;
var client = Meteor.npmRequire('twilio')(twilioAccountSID, twilioAuthToken );
var Future = Npm.require('fibers/future');
var Fiber  = Npm.require('fibers');

Meteor.methods({

    smsOrderReceived :function (order, toPhoneNumber, whoReceiving)
    {

        var response = {};
        var CLIENT_NAME;
        var body ;
        var ORDER_STATUS_URL      = Meteor.absoluteUrl('os', {replaceLocalhost:true})+ "/";
        console.log('smsOrderReceived: ORDER_STATUS_URL = ' +ORDER_STATUS_URL);   

        switch (whoReceiving)
        {

          case 'client':

          case 'webmaster':

                body      = 'New Order[' + order.OrderNumber + '] \n';
                body     += order.Items + '\n';
                body     +=   ORDER_STATUS_URL + order.UniqueId;

              break;

          default:
            

                CLIENT_NAME           = Meteor.call('getSetting','store_name', order.orgname);
                console.log('smsOrderReceived: CLIENT_NAME = ' +CLIENT_NAME); 
                
                body      = 'Received Order[' + order.OrderNumber + '] \n';
                body     += order.Items + '\n';
                body     += ' - ' + CLIENT_NAME + ' \n' ;
                body     +=   ORDER_STATUS_URL + order.UniqueId;

        }


        try{
          var result = sendSMS (  
                    order.sessionId,
                    order.OrderNumber,
                    toPhoneNumber, 
                    body
                  );

         response.result = result;

        for(var key in response.result)
        {
              console.log(key + ' = ' + response.result[key]);
              //smsCustomer[key] = response.result[key];
        }

        }catch(e)
        {

          console.log(order.sessionId +': smsOrderReceived : Trouble sending sms to the customer' + e);
          response.status = STATUS_FATAL;
          response.error = e.toString();

        }

        return response;

    },



    smsOrderReady:function (order)
    {

         var body = 'Order[' +order.OrderNumber + '] is ready - DosaHouse \n' + ORDER_STATUS_URL + order.UniqueId;
         sendSMS (  order.OrderNumber,
                    order.CustomerPhone, 
                    body);

    }

});

var sendSMS = function (sessionId, orderNumber, toPhoneNumber, bodyMessage) {

    console.log("sendSMS : twilioAccountSID       = "   +  twilioAccountSID );
    console.log("sendSMS : twilioAuthToken        = "   +  twilioAuthToken);
    console.log("sendSMS : twilioFromPhoneNumber  = "   +  twilioFromPhoneNumber);
    console.log("sendSMS : toPhoneNumber          = "   +  toPhoneNumber);
    console.log("sendSMS : bodyMessage            = "   +  bodyMessage);

    var result ={};

    var smsMessage = new Future();
      client.messages.create({

                          to    : toPhoneNumber, 
                          from  : twilioFromPhoneNumber,
                          body  : bodyMessage

                        }, Meteor.bindEnvironment (function (error, message)
                          {

                              if(error)
                              {
                                result.status     = STATUS_FAILED;
                                result.error      = error;

                                for(var key in error)
                                  {
                                    console.log(sessionId + ": error object from sms: " + key + " = " + error[key]);
                        
                                  }
                                console.log(sessionId + " : Done Invoking sms - Yes Error");
                        

                              }
                              else
                              {
                                for(var key in message)
                                  {
                                    console.log(sessionId + ": message object from sms: " + key + " = " + message[key]);
                        
                                  }
                                result.status   = STATUS_SUCCESS;  
                                result.message  = message;
                                console.log(sessionId + " : Done Invoking sms - No Error");

                              }
                            console.log("sendSMS: result = " + result)  ;
                            smsMessage.return(result);
                        }));

return smsMessage.wait();
      
}