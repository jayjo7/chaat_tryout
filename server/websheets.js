Meteor.methods({


	postWebsheets:function(doc)
	{
		var response ={};
    var sheetsUrl = websheetsUrl(doc.orgname);
    //console.log(doc.sessionId + ": postWebsheets:sheetsUrl: " + sheetsUrl);
		 try{
  				
  			response = HTTP.post(sheetsUrl,
  			  	{
  					data: doc,
  					followAllRedirects: true
  				});

        console.log(doc.sessionId +": postWebsheets:response:: " +JSON.stringify(response, null, 4));

  			console.log(doc.sessionId + ": postWebsheets:Done invoking HTTP.Post to websheets");

  			if(response.statusCode != 200)
  			{
  				console.log('postWebsheets-Failed', 'Order posting to websheets failed with http status code [' + response.statusCode  + ']', e);
  			}
        else
        {
            console.log(doc.sessionId +": postWebsheets:response.content:: " +JSON.stringify(response.content, null, 4));

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