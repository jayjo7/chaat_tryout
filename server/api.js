if(Meteor.isServer) {

	Restivus.configure({

    prettyJson: true

  });


	Restivus.addRoute('sheetSync', {authRequired: false }, {

		get: 
		{
			action: function()
			{
				return {result:{ statusCode:'200', status:STATUS_SUCCESS, data:'sheetSync' }}
			
			}
		},

		put:
		{



			action: function()
			{
				var collectiveResult = [];
				var sessionid = Meteor.uuid();

				var bodyJason = this.bodyParams;
				console.log(sessionid + ": sheetSync: Number of objects received in boday parms = " + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					console.log(sessionid + ': sheetSync: Received.bodyParams = ' + JSON.stringify(bodyJason, null, 4));

					for(var key in bodyJason)
					{
						console.log(sessionid + ': sheetSync: ' + key + ' = ' + bodyJason[key]);

						console.log(sessionid + ': sheetSync: Working with the worksheet = ' + key);

						var data= bodyJason[key];
						console.log(sessionid + ': sheetSync: Number of records received = ' + data.length);
						var result 			={};
						result.worksheet 	= key;
						result.status 		= STATUS_SUCCESS;	
						
						for (i=0; i<data.length; i++)
						{


							for (var keyData in data[i])
							{
								console.log( sessionid + ': sheetSync: data [ ' + i  +' ] [' + keyData + ' ] = ' + data[i][keyData]);
							}

							try{
						   		CollectionDriver.prototype.upsert(key, data[i], UNIQUE_ID_NAME, ORG_KEY_NAME , Meteor.bindEnvironment(function(err, doc){

						   			if (err) 
          							{ 
									   		result.status 		=  STATUS_FAILED;
											result.error		=  err;
          							}  
          							else
          							{
          									result.action 		= 'upsert';
											result.receiveddata =  data[i];
											if( ORDERS === key.toUpperCase())
											{
												Meteor.call('sendReadyNotification', sessionid, doc);
											}
          							}	
						   		}));
						   	}catch(e)
						   	{
						   		result.status 		=  STATUS_FAILED;
								result.error		=  e;
						   	}
						}	
						collectiveResult.push(result);
					}	

					return  { result: { statusCode 	: 200,
										status 		: STATUS_SUCCESS,
										data 		: collectiveResult,
										message 	: sessionid + ': sheetSync: Processed Sucessfully, investigate the result for individual result'
										}
							}									

				}
				else
				{
					return { result: { 	statusCode 	:  401,
										status 		:  STATUS_FAILED,
										message 	:  sessionid + ': sheetSync: The request body is empty'
									 }
							}

				}

			}
		}

	});

	Restivus.addRoute('sheetSyncFull', {authRequired: false }, {

		get: 
		{
			action: function()
			{
				return {result:{ statusCode:'200', status:STATUS_SUCCESS, data:'sheetSyncFull' }}
			}
		},

		put:
		{



			action: function()
			{
				var collectiveResult = [];
				var sessionid = Meteor.uuid();


				var dataFromDb 

				var bodyJason = this.bodyParams;
				console.log(sessionid + ': sheetSyncFull: Number of objects received in boday parms = ' + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					for(var key in bodyJason)
					{
						var result 		 	={};
						result.worksheet 	= key;
						result.status 		= STATUS_SUCCESS;	
						var data= bodyJason[key];
						console.log(sessionid + ': data[0].orgname = ' + data[0].orgname);

						CollectionDriver.prototype.findAll (key, { orgname : data[0].orgname}, Meteor.bindEnvironment(function(err,docFromDb)
						{
							console.log(sessionid + ': sheetSyncFull: Working with the worksheet = ' + key);

							if(err)
							{
								console.log(sessionid + ': sheetSyncFull: Trouble reteriving the data from mongodb :key = '+ key + ' : orgname = ' + data[0].orgname); 
								result.status 		= STATUS_FAILED;	
								result.message      = sessionid + ': sheetSyncFull: Trouble reteriving the data from mongodb :key = ' + key + ' : orgname = ' + data[0].orgname
								result.error		= err;
							}
							else
							{
								dataFromDb = docFromDb;
								console.log(sessionid + ': sheetSyncFull: Size of array received from db : '+ dataFromDb.length);

						    	console.log(sessionid + ': sheetSyncFull: Number of records received = ' + data.length);

						    	for(var i=0; i<data.length; i++)
						    	{
						    		console.log ( sessionid + ': sheetSyncFull: data[' + i + '].UniqueId = ' + data[i].UniqueId);

						    		for(var keyFromDB in dataFromDb)
						    		{
						    			//console.log("sheetSyncFull: Data From DB Key = " + keyFromDB);
						    			//console.log("sheetSyncFull: UniqueId = " + dataFromDb[keyFromDB].UniqueId);
						  		    	//console.log("sheetSyncFull: _id= " + dataFromDb[keyFromDB]._id);
				  		

						    			if(data[i].UniqueId === dataFromDb[keyFromDB].UniqueId)
						    			{
						    				dataFromDb.splice(keyFromDB, 1);
						    				break;
						    			}
						    		}
						    	}
						    }

						    console.log(sessionid + ': sheetSyncFull: Size of array received from db after check : '+ dataFromDb.length);

						    //var fullSyncResult=[];

							for(var keyFromDB in dataFromDb)
						    {
						    	console.log (sessionid + ': sheetSyncFull: Deleting _id = ' + 	 dataFromDb[keyFromDB]._id);
						    	console.log (sessionid + ': sheetSyncFull: uniqueid     = ' + 	 dataFromDb[keyFromDB][UNIQUE_ID_NAME]);

						    	CollectionDriver.prototype.delete(key, dataFromDb[keyFromDB]._id, Meteor.bindEnvironment(function(err, doc)
						    	{
						    		console.log (sessionid + ': sheetSyncFull: doc on delete = ' + JSON.stringify(doc, null, 4))

						    		if(err)
						    		{
						    			console.log (sessionid + ': sheetSyncFull: Trouble deleting the record with UniqueId : ' + dataFromDb[keyFromDB][UNIQUE_ID_NAME]);
						    			console.log (sessionid + ': error = ' + err);
										result.status 		= STATUS_FAILED;	
										result.message      = sessionid + ': sheetSyncFull: Trouble deleting the record with UniqueId : ' + dataFromDb[keyFromDB][UNIQUE_ID_NAME];
										result.data         = dataFromDb[keyFromDB];
										result.error		= err;
									}
						    		else
						    		{

						    			console.log (sessionid + ': sheetSyncFull: Sucessfully deleted the record with UniqueId : ' + dataFromDb[keyFromDB][UNIQUE_ID_NAME]);
						    			
						    		}
						    	}));


						    }	


							for (i=0; i<data.length; i++)
							{

						   			CollectionDriver.prototype.upsert(key, data[i], UNIQUE_ID_NAME, ORG_KEY_NAME , Meteor.bindEnvironment(function(err,doc) 
						   			{
						   				console.log (sessionid + ': sheetSyncFull: doc on upsert = ' + JSON.stringify(doc, null, 4))

				          				if (err) 
				          				{ 
						    				console.log (sessionid + ': sheetSyncFull: Trouble upserting the record with UniqueId : ' + data[i][UNIQUE_ID_NAME]);
											result.status 		= STATUS_FAILED;	
											result.message      = sessionid + ': sheetSyncFull: Trouble upserting the record with UniqueId : ' + data[i][UNIQUE_ID_NAME];
											result.data         = data[i][UNIQUE_ID_NAME]
											result.error		= err;				          					

				          				}  
          							    else
          							    {
          									result.action 		= 'upsert';
											result.receiveddata =  data[i];
											if( ORDERS === key.toUpperCase())
											{
												Meteor.call('sendReadyNotification', sessionid, doc);
											}
          							    }
				     			}));
							}


					



						}));
					collectiveResult.push(result);
					}

					return  { result: { statusCode 	: 200,
										status 		: STATUS_SUCCESS,
										data 		: collectiveResult,
										message 	: sessionid + ': sheetSyncFull: Processed Sucessfully, investigate the result for individual result'
										}
							}	


				}
				else
				{

					return { result: { 	statusCode 	:  401,
										status 		:  STATUS_FAILED,
										message 	: sessionid + ': sheetSyncFull: The request body is empty'
									 }
							}

				}					

				
			}

		}

});

}




