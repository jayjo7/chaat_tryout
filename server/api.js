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

				var bodyJason = this.bodyParams;
				console.log("sheetSync: Number of objects received in boday parms = " + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					console.log('sheetSync: Received.bodyParams = ' + JSON.stringify(bodyJason, null, 4));

					for(var key in bodyJason)
					{
						console.log('sheetSync: ' + key + ' = ' + bodyJason[key]);

						console.log( "sheetSync: Working with the worksheet = " + key);

						var data= bodyJason[key];
						console.log( "sheetSync: Number of records received = " + data.length);
						var result 			={};
						result.worksheet 	= key;
						result.status 		= STATUS_SUCCESS;	
						
						for (i=0; i<data.length; i++)
						{
							result.receiveddata =  data[i];

							for (var keyData in data[i])
							{
								console.log( "sheetSync: data [ " + i  +' ] [' + keyData + " ] = " + data[i][keyData]);
							}

							try{
						   		CollectionDriver.prototype.upsert(key, data[i], UNIQUE_ID_NAME, ORG_KEY_NAME , function(err, result){

						   			if (err) 
          							{ 
									   		result.status 		=  STATUS_FAILED;
											result.error		=  err;
          							}  
						   		});
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
										message 	: "sheetSync: Processed Sucessfully, investigate the result for individual result"
										}
							}									

				}
				else
				{
					return { result: { 	statusCode 	:  401,
										status 		:  STATUS_FAILED,
										message 	: "sheetSync: The request body is empty"
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

					var dataFromDb 

				var bodyJason = this.bodyParams;
				console.log("sheetSyncFull: Number of objects received in boday parms = " + Object.keys(bodyJason).length);
				if(Object.keys(bodyJason).length)
				{
					   	result 				={};
						result.worksheet 	= key;
						result.status 		= STATUS_SUCCESS;	


					for(var key in bodyJason)
					{
						var data= bodyJason[key];
						console.log('data[0].orgname = ' + data[0].orgname);

						CollectionDriver.prototype.findAll (key, { orgname : data[0].orgname}, function(err,results)
						{
							console.log( "sheetSyncFull: Working with the worksheet = " + key);

							if(err)
							{
								console.log("sheetSyncFull: Trouble reteriving the data from mongodb :key = " + key + ' : orgname = ' + data[0].orgname); 
								result.status 		= STATUS_FAILED;	
								result.message      = "sheetSyncFull: Trouble reteriving the data from mongodb :key = " + key + ' : orgname = ' + data[0].orgname
								result.error		= err;
							}
							else
							{
								dataFromDb = results;
								console.log("sheetSyncFull: Size of array received from db : " + dataFromDb.length);

						    	console.log( "sheetSyncFull: Number of records received = " + data.length);

						    	for(var i=0; i<data.length; i++)
						    	{
						    		console.log ( "sheetSyncFull: data[" + i + "].UniqueId = " + data[i].UniqueId);

						    		for(var keyFromDB in dataFromDb)
						    		{
						    			console.log("sheetSyncFull: Data From DB Key = " + keyFromDB);
						    			console.log("sheetSyncFull: UniqueId = " + dataFromDb[keyFromDB].UniqueId);
						  		    	console.log("sheetSyncFull: _id= " + dataFromDb[keyFromDB]._id);
				  		

						    			if(data[i].UniqueId === dataFromDb[keyFromDB].UniqueId)
						    			{
						    				dataFromDb.splice(keyFromDB, 1);
						    				break;
						    			}
						    		}
						    	}
						    }

						    console.log("sheetSyncFull: Size of array received from db after check : " + dataFromDb.length);

						    //var fullSyncResult=[];

							for(var keyFromDB in dataFromDb)
						    {	  
						    	CollectionDriver.prototype.delete(key, dataFromDb[keyFromDB]._id, function(err, results)
						    	{
						    		if(err)
						    		{
						    			console.log ("sheetSyncFull: Trouble deleting the record with UniqueId : " + dataFromDb[keyFromDB][UNIQUE_ID_NAME]);
										result.status 		= STATUS_FAILED;	
										result.message      = "sheetSyncFull: Trouble deleting the record with UniqueId : " + dataFromDb[keyFromDB][UNIQUE_ID_NAME];
										result.data         = dataFromDb[keyFromDB];
										result.error		= err;
									}
						    		else
						    		{

						    			console.log ("sheetSyncFull: Sucessfully deleted the record with UniqueId : " + dataFromDb[keyFromDB][UNIQUE_ID_NAME]);
						    			
						    		}
						    	});


						    }	


							for (i=0; i<data.length; i++)
							{

						   			CollectionDriver.prototype.upsert(key, data[i], UNIQUE_ID_NAME, ORG_KEY_NAME ,function(err,docs) 
						   			{
				          				if (err) 
				          				{ 
						    				console.log ("sheetSyncFull: Trouble upserting the record with UniqueId : " + data[i][UNIQUE_ID_NAME]);
											result.status 		= STATUS_FAILED;	
											result.message      = "sheetSyncFull: Trouble upserting the record with UniqueId : " + data[i][UNIQUE_ID_NAME];
											result.data         = data[i][UNIQUE_ID_NAME]
											result.error		= err;				          					

				          				}  
				     			});
							}


					



						});
					
					}

					return  { result: { statusCode 	: 200,
										status 		: STATUS_SUCCESS,
										data 		: collectiveResult,
										message 	: "sheetSyncFull: Processed Sucessfully, investigate the result for individual result"
										}
							}	


				}
				else
				{

					return { result: { 	statusCode 	:  401,
										status 		:  STATUS_FAILED,
										message 	: "sheetSyncFull: The request body is empty"
									 }
							}

				}					

				
			}

		}

});

}


