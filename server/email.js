var options = {
        apiKey: mailGunApiKey,
        domain: mailGunDomain
        }
var sendEmail = new Mailgun(options);


Meteor.methods({

    sendCCAuthFailedNotification:function(order)
    {
        var response      =   {};
        response.status   =   STATUS_SUCCESS;
        var CLIENT_NAME      = Meteor.call('getSetting','store_name', order.orgname);
        var subject       =    'Credit Card declined - ' + CLIENT_NAME ; 
        var body          =   Meteor.call('getSetting','order_status_alert_message' , order.orgname) + '\n\n' + buildOrderReceivedBody(order);

        //Send Email to customer
        try{
            sendEmail.send({
                                     'to'     :   order.CustomerEmail,
                                     'from'   :   fromEmailAddress ,
                                     'bcc'    :   clientEmailAddress,
                                     'text'   :   body,
                                     'subject':   subject

                                 });
        }catch(e)
        {
          console.log('sendCCAuthFailedNotification: Trouble sending email to the customer' + e);
          response.status   =   STATUS_FAILED;
          response.error    =   e.toString();
        }

      return response;
    },

    sendOrderReceivedEmailClient:function(order)
    {
        var response ={};
        response.status=STATUS_SUCCESS;
        var body      =  buildOrderReceivedBody(order)
        try{

              var CLIENT_NAME      = Meteor.call('getSetting','store_name' , order.orgname);
              subject = 'Owner ' +  CLIENT_NAME+': Received Order [' + order.OrderNumber + ']';
              
              sendEmail.send({
                                'to'     :   clientEmailAddress,
                                'from'   :   fromEmailAddress ,
                                'text'   :   body,
                                'subject':   subject 
                              });
          }catch (e)
          {
            console.log('sendOrderReceivedEmailClient: Trouble sending email to the client' + e);
            response.status   =  STATUS_FAILED;
            response.error    =  e.toString();
          }
      return response;

    },
    sendOrderReceivedEmailWebmaster:function(order)
    {
        var response ={};
        response.status=STATUS_SUCCESS;
        var body      =  buildOrderReceivedBody(order)
        try{

              var CLIENT_NAME      = Meteor.call('getSetting','store_name' , order.orgname);
              subject = 'Owner ' +  CLIENT_NAME+': Received Order [' + order.OrderNumber + ']';
              
              sendEmail.send({
                                'to'     :   webmasterEmailAddress,
                                'from'   :   fromEmailAddress ,
                                'text'   :   body,
                                'subject':   subject 
                              });
          }catch (e)
          {
            console.log('sendOrderReceivedEmailClient: Trouble sending email to the client' + e);
            response.status =   STATUS_FAILED;
            response.error  =   e.toString();
          }
      return response;

    },

    sendOrderReceivedEmail: function(order)
    {

        var response ={};
        response.status=STATUS_SUCCESS;
        var subject   = 'Your Order [' + order.OrderNumber + ']';
        var body      =  buildOrderReceivedBody(order)

        //Send Email to customer
        try{
          	sendEmail.send({
                                     'to'		  : 	order.CustomerEmail,
                                     'from'	  : 	fromEmailAddress ,
                                     'text'	  : 	body,
                                     'subject': 	subject

                                 });
        }catch(e)
        {
          console.log('sendOrderReceivedEmail: Trouble sending email to the customer' + e);
          response.status   =   STATUS_FAILED;
          response.error    =   e.toString();
        }

      return response;
    }

});



var buildOrderReceivedBody = function(order)
{

    var CLIENT_PHONE_NUMBER   = Meteor.call('getSetting', 'phone_number'  , order.orgname);
    console.log('buildOrderReceivedBody: CLIENT_PHONE_NUMBER = ' +CLIENT_PHONE_NUMBER);
    var CLIENT_ADDRESS        = Meteor.call('getSetting', 'address' , order.orgname);
    console.log('buildOrderReceivedBody: CLIENT_ADDRESS = ' +CLIENT_ADDRESS);    
    var CLIENT_NAME           = Meteor.call('getSetting','store_name' , order.orgname);
    console.log('buildOrderReceivedBody: CLIENT_NAME = ' +CLIENT_NAME);    
    var EMAIl_CUSTOM_MESSAGE     = Meteor.call('getSetting','email_custom_message' , order.orgname);
    console.log('buildOrderReceivedBody: EMAIl_CUSTOM_MESSAGE  = ' +EMAIl_CUSTOM_MESSAGE );    
    var ORDER_STATUS_URL      = Meteor.absoluteUrl('os', {replaceLocalhost:true}) + "/";
    console.log('buildOrderReceivedBody: ORDER_STATUS_URL = ' +ORDER_STATUS_URL);
  
	  var body= order.CustomerName + ', Thank you for your order.' +'\n\n' ;

        
      body = body + 'Your Order # [' + order.OrderNumber + ']\n\n';
      body = body + 'You Ordered:'+ '\n\n';
      
      body = body + order.Items + '\n\n';
      
      body = body + '--------------------------'+ '\n';
      body = body + 'Total with tax = $'+ order.Total + '\n';
      body = body + '--------------------------'+ '\n\n';
      
      body = body + 'Call us at: ' + CLIENT_PHONE_NUMBER +', if you need to change your order.' + '\n\n';
      
      
      body = body + 'Pickup Address:'+ '\n\n';
      
      
      //body = body + CLIENT_ADDRESS_LINE1 + '\n';
      //body = body + CLIENT_ADDRESS_LINE2+ '\n\n';
      body = body + CLIENT_ADDRESS+ '\n\n';
      body = body + 'We will email you when your order is ready for pickup'+ '\n\n';
      
      
      
      body = body + 'See you soon!'+ '\n';
      body = body + '- ' +  CLIENT_NAME + '\n';
 
       
      body = body + "\n\n";
      
      body = body + 'Check status at: \n';
      body = body + ORDER_STATUS_URL+ order.UniqueId;


      if(EMAIl_CUSTOM_MESSAGE)
      {
        body = body + '\n\n\n' + EMAIl_CUSTOM_MESSAGE;
      }
      
      body = body + '\n\n' + 'Auto generated, please do not reply to this email. If needed please email ' + clientEmailAddress;
      console.log(order.sessionId + ' :buildOrderReceivedBody:body = ' + body);
      return body;

}