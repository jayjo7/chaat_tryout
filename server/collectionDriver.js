var ObjectID    = Meteor.npmRequire('mongodb').ObjectID;
var MongoClient = Meteor.npmRequire('mongodb').MongoClient

var collectionDriver;
var mongodb_url =  process.env.MONGO_URL;

CollectionDriver = function(db) {
  db = db;
};

CollectionDriver.prototype.getCollection = function(collectionName, callback) {
    //console.log("collectionName = " + collectionName);
    MongoClient.connect(mongodb_url, {native_parser:true}, function(err, db) 
    {
        if(err)
        {   
            console.log(err);
            console.log("Trouble connecting to the database ...");
        }
        else
        {   //console.log("Connected to " + mongodb_url);
            //console.log("Connected to the database sucessfully ...");
            db.collection(collectionName, function(error, the_collection) {
            if( error ) callback(error);
            else callback(null, the_collection);
  });        }

    });


};

//find all objects for a collection
CollectionDriver.prototype.findAll = function(collectionName, queryObject, callback) {
    for (var key in queryObject)
    {
        console.log("findAll: " + key  + ' = ' + queryObject[key]);
    }
    this.getCollection(collectionName, function(error, the_collection) { 
      if( error ) callback(error)
      else {
        the_collection.find(queryObject).toArray(function(error, results) { 
          if( error ) callback(error)
          else callback(null, results)
        });
      }
    });
};


//find a specific object
CollectionDriver.prototype.getOneByGivenCriteria = function(collectionName, searchKey,  serchvalue, callback) 
{ 

        console.log('collectionName = ' + collectionName);
        console.log('searchKey = ' + searchKey);
        console.log('serchvalue = ' + serchvalue);



    this.getCollection(collectionName, function(error, the_collection) {
        if (error) 
          {
            console.log("getOneByGivenCriteria: " + error);
            callback(error);
          }
        else {

          console.log('collectionName = ' + the_collection);

          the_collection.findOne({searchKey:serchvalue},function(error,doc) { 
              if (error) 
              callback(error)
              else callback(null, doc);
            });

        }
    });

}


//find a specific object
CollectionDriver.prototype.get = function(collectionName, id, callback) 
{ 
    this.getCollection(collectionName, function(error, the_collection) 
    {
        if (error) callback(error)
        else 
        {
            var checkForHexRegExp = new RegExp("^[0-9a-fA-F]{24}$"); 
            if (!checkForHexRegExp.test(id)) callback({error: "invalid id"});
            else the_collection.findOne({'_id':ObjectID(id)}, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//save new object
CollectionDriver.prototype.save = function(collectionName, obj, callback) {
    this.getCollection(collectionName, function(error, the_collection) { 
      if( error ) callback(error)
      else {
        obj.created_at = new Date(); 
        the_collection.insert(obj, function() { 
          callback(null, obj);
        });
      }
    });
};

//update a specific object
CollectionDriver.prototype.update = function(collectionName, obj, entityId, callback) {
    this.getCollection(collectionName, function(error, the_collection) {
        if (error) callback(error)
        else {
	        obj._id = ObjectID(entityId); 
	        obj.updated_at = new Date(); 
            the_collection.save(obj, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, obj);
            });
        }
    });
}


//update a specific object
CollectionDriver.prototype.upsert = function(collectionName, obj, uniqueIdName, orgName,  callback) 
{
    //console.log("trying to connect to mongodb...")
    this.getCollection(collectionName, function(error, the_collection) 
    {
        if (error) 
        {	
        	callback(error)
        }
        else 
        {

        	//console.log("obj[" + uniqueIdName +"] = " + obj[uniqueIdName]);
            //console.log("obj[" + orgName +"] = " + obj[orgName]);

        	var queryObject            = {};
        	queryObject[uniqueIdName]  = obj[uniqueIdName];
            queryObject[orgName]       = obj[orgName];


        	the_collection.findAndModify(
        							queryObject,
        							{},
        							obj,
        							{new:false, upsert:true},
        							function(error,doc) 
        								{ 
            								if (error) 
            								{
            									console.log("Error  in upsert")
            									callback(error)
            								}
            								else 
            								{
            									//console.log("Upsert Sucessfull, here is the doc:" + doc);
            									callback(null, obj);
            								}
            							}	


        	);




/**        	the_collection.update(
        							{uniqueIdName: obj[uniqueIdName]},
        							obj,
        							{upsert:true},
        							function(error,doc) 
        								{ 
            								if (error) 
            								{
            									console.log("Error  in upsert")
            									callback(error)
            								}
            								else 
            								{
            									console.log("Upsert Sucessfull, here is the doc:" + obj);
            									callback(null, obj);
            								}
            							});
**/

        }
    });
}



//delete a specific object
CollectionDriver.prototype.delete = function(collectionName, entityId, callback) {
    console.log('collectionName = ' + collectionName);
    console.log('entityId = ' + entityId);


    this.getCollection(collectionName, function(error, the_collection) { 
        if (error) callback(error)
        else {
            the_collection.remove({'_id':entityId}, function(error,doc) { 
            	if (error) callback(error)
            	else callback(null, doc);
            });
        }
    });
}

//exports.CollectionDriver = CollectionDriver;