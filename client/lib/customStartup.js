
Meteor.startup(function() {


	 	$('html').attr('lang', 'en');

	 	$('body').attr('class', 'index body');
		$('body').attr('id', 'page-top');
        $('body').attr('ontouchstart', " ");


        var appUUID = Session.get('appUUID');
        if(appUUID)
        {

            console.log(appUUID + ":Startup: appUUID from the session = " + appUUID);

        }
        else
        {

    	    var d = new Date().getTime();
        	var appUUID = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) 
            {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
        	});
            
        	Session.setPersistent('appUUID', appUUID);
        	console.log(appUUID + ":Startup: New appUUID stored in local storage = " + uuid);

        }

	}

    


);