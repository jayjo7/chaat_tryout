
 var sendEmail;

Meteor.methods({

    sendCCAuthFailedNotification:function(order)
    {
        initializeMailGun(order.orgname);
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

    emailOrderReceived : function(order, whoReceiving)
    {

      initializeMailGun(order.orgname);
      var response      = {};
      response.status   = STATUS_SUCCESS;
      var body          = buildOrderReceivedBody(order);
      var toEmailAddress;

      switch (whoReceiving)
        {

          case 'client':
              toEmailAddress      = clientEmailAddress (order.orgname);
              var CLIENT_NAME     = Meteor.call('getSetting','store_name' , order.orgname);
              subject = 'Owner ' +  CLIENT_NAME+': Received Order [' + order.OrderNumber + ']';

              break;

          case 'webmaster':
              toEmailAddress      = webmasterEmailAddress (order.orgname);
              var CLIENT_NAME     = Meteor.call('getSetting','store_name' , order.orgname);
              subject = 'Owner ' +  CLIENT_NAME+': Received Order [' + order.OrderNumber + ']';

              break;

          default:
            
              var subject     = 'Your Order [' + order.OrderNumber + ']';
              toEmailAddress  =  order.CustomerEmail;


        }

              //Send Email to customer
        try{
            var result = sendEmail.send({
                                     'to'     :   toEmailAddress,
                                     'from'   :   fromEmailAddress(order.orgname),
                                     'text'   :   body,
                                     'subject':   subject

                                 });
            response.result = result;
              
            console.log(order.sessionId +": emailOrderReceived : result received from vendor: " +JSON.stringify(response.result, null, 4));

                       
        }catch(e)
        {
          console.log('emailOrderReceived: Trouble sending email to the customer' + e);
          var result ={};
          result.status = STATUS_FATAL;
          result.error = e.toString();
          response.result = result;
        }

      return response;  


    },


});

var initializeMailGun = function(orgname)
{
          var options = {
          apiKey: mailGunApiKey(orgname),
          domain: mailGunDomain(orgname)
          }
        //console.log("initializeMailGun : options: " +JSON.stringify(options, null, 4));

        sendEmail = new Mailgun(options);

}



var buildOrderReceivedBody = function(order)
{

    var CLIENT_PHONE_NUMBER   = Meteor.call('getSetting', 'phone_number'  , order.orgname);
    //console.log('buildOrderReceivedBody: CLIENT_PHONE_NUMBER = ' +CLIENT_PHONE_NUMBER);
    var CLIENT_ADDRESS        = Meteor.call('getSetting', 'address' , order.orgname);
    //console.log('buildOrderReceivedBody: CLIENT_ADDRESS = ' +CLIENT_ADDRESS);    
    var CLIENT_NAME           = Meteor.call('getSetting','store_name' , order.orgname);
    //console.log('buildOrderReceivedBody: CLIENT_NAME = ' +CLIENT_NAME);    
    var EMAIl_CUSTOM_MESSAGE     = Meteor.call('getSetting','email_custom_message' , order.orgname);
    //console.log('buildOrderReceivedBody: EMAIl_CUSTOM_MESSAGE  = ' +EMAIl_CUSTOM_MESSAGE );    
    var ORDER_STATUS_URL      = Meteor.absoluteUrl('os', {replaceLocalhost:true}) + "/";
    //console.log('buildOrderReceivedBody: ORDER_STATUS_URL = ' +ORDER_STATUS_URL);
  
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
      
      body = body + '\n\n' + 'Auto generated, please do not reply to this email. If needed please email ' + clientEmailAddress(order.orgname);
      console.log(order.sessionId + ' :buildOrderReceivedBody:body = ' + body);
      return body;

}