Meteor.methods({


	postWebsheets:function(doc)
	{
		var response ={};
    var sheetsUrl = websheetsUrl(doc.orgname);
    console.log(doc.sessionId + ": postWebsheets:sheetsUrl: " + sheetsUrl);
		 try{
  				
  			response = HTTP.post(sheetsUrl,
  			  	{
  					data: doc,
  					followAllRedirects: true
  				});

  			for (var key in response)
  			{
  				console.log(doc.sessionId + ": postWebsheets:response:" + key + " = " + response[key]);
  			}
  			console.log(doc.sessionId + ": postWebsheets:Done invoking HTTP.Post to websheets");

  			if(response.statusCode != 200)
  			{
  				console.log('postWebsheets-Failed', 'Order posting to websheets failed with http status code [' + response.statusCode  + ']', e);
  			}

							
		}catch (e)
		{
			console.log(doc.sessionId + ': postWebsheets-Failed', 'Could not post the order to Websheets', e);
			response.websheetsError = e;
      response.websheets  = false;
		}

		return response;

	}

});