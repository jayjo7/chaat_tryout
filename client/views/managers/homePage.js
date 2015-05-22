NOTIFICATION_MESSAGE_KEY = 'notification_message';

var notificationkey = Session.get(ORG_NAME_SESSION_KEY) + '_' + NOTIFICATION_MESSAGE_KEY;


Template.homePage.helpers({


    notification_message_session:function()
    {

        return Session.get(notificationkey);

    },

    haveNotification: function(notification_general,isNotTakingOnlineOrder, isStoreClosed)
    {
        //console.log("notification_general = " + notification_general);
        ////console.log("notification_general.lenght = " + notification_general.length);
        //console.log("isNotTakingOnlineOrder= " + isNotTakingOnlineOrder);
        //console.log("isStoreClosed = " + isStoreClosed);

        var orgname = Session.get(ORG_NAME_SESSION_KEY);


        if(isNotTakingOnlineOrder)
        {        
                var settings = Settings.findOne({$and : [{Key: "notification_no_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                //console.log('notification_no_online_orders: message Notification = ' + settingsValue);
                //console.log('notification_no_online_orders: Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                //console.log('notification_no_online_orders: Notification trimmed size = ' + settingsValue.trim().length);

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                //console.log('settingsArray.length = ' + settingsArray);
                Session.set(notificationkey, settingsArray);

                return true;
        }

        if(isStoreClosed)
        {

                var settings = Settings.findOne({$and : [{Key: "notification_store_closed"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                //console.log(' notification_store_closed: message Notification = ' + settingsValue);
                //console.log(' notification_store_closed: Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                //console.log(' notification_store_closed: Notification trimmed size = ' + settingsValue.trim().length);

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                //console.log('settingsArray.length = ' + settingsArray);
                Session.set(notificationkey, settingsArray);
                return true;
        }

        if(typeof notification_general != 'undefined' && notification_general.length> 0)

        {
            Session.set(notificationkey, notification_general)
            return  true;

        }
        else
        {
            Session.set(notificationkey, null)

            return false;
        }

    },



    notification: function()
    {
        var orgname = Session.get(ORG_NAME_SESSION_KEY);


        var settings = Settings.findOne({$and : [{Key: "notification_general"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                //console.log(' message Notification = ' + settingsValue);
                //console.log(' message Notification trimmed= ' + settingsValue.trim());
                var settingsValueTrimed = settingsValue.trim();
                //console.log(' message Notification trimmed size = ' + settingsValue.trim().length);


                 var settingsArray=[];


                if(settingsValue.trim().length> 0)
                {

                    settingsArray = settingsValue.split('\n\n' );

                }

                //console.log('settingsArray.length = ' + settingsArray);

   

                return settingsArray;
            

    },

    isNotTakingOnlineOrder: function()
    {
        var orgname = Session.get(ORG_NAME_SESSION_KEY);

        var store_online_orders= Settings.findOne({$and : [{Key: "store_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
        //console.log("store_online_orders = " + store_online_orders.Value.trim());

        if('NO' === store_online_orders.Value.trim().toUpperCase())
        {
            return true
        }
        else
        {
            return false;
        }

    },

    isStoreClosed: function()
    {

        var orgname = Session.get(ORG_NAME_SESSION_KEY);

        var store_open_time= Settings.findOne({$and : [{Key: "store_open_time"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var store_close_time= Settings.findOne({$and : [{Key: "store_close_time"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
        var gmt_offset= Settings.findOne({$and : [{Key: "gmt_offset"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

        //var store_close_time_24 = store_close_time.Value + 12;

       //console.log("store_open_time = " + store_open_time.Value);
       //console.log("store_close_time from sheet = " + store_close_time.Value);
       ////console.log("store_close_time_24 = " + store_close_time_24);    
       //console.log("gmt_offset = " + gmt_offset.Value);



            var momentDate=moment().utcOffset(Number(gmt_offset.Value))
            var currentday =momentDate.day();
            var currentTime =momentDate.hour();

            //console.log("currentday = " + currentday);
            //console.log("currentTime = " + currentTime);


            if (currentday === 0  || (currentday === 6)) //Sunday
            {
                var store_open_saturday     = Settings.findOne({$and : [{Key: "store_open_saturday"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                var store_open_sunday       = Settings.findOne({$and : [{Key: "store_open_sunday"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});


                //console.log("store_open_saturday    = " + store_open_saturday.Value);
                //console.log("store_open_sunday      = " + store_open_sunday.Value);

                if( 'NO'=== store_open_sunday.Value.trim().toUpperCase() || 'NO'=== store_open_saturday.Value.trim().toUpperCase() )
                {
                    return true;
                }
                else
                {
                    var store_open_time_weekend = Settings.findOne({$and : [{Key: "store_open_time_weekend"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                    var store_close_time_weekend= Settings.findOne({$and : [{Key: "store_close_time_weekend"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]});
                    //console.log("store_open_time_weekend    = " + store_open_time_weekend.Value);
                    //console.log("store_close_time_weekend   = " + store_close_time_weekend.Value);

                    if(currentTime >= store_open_time_weekend.Value  &&  currentTime < store_close_time_weekend.Value)
                    {
                        //console.log("Store Open on Weekend")

                        return  false;
                    }
                    else
                    {
                        //console.log("Store close on Weekend")

                        return true;
                    }


                }

            }

            if(currentTime >= store_open_time.Value  &&  currentTime < store_close_time.Value)
            {
                //console.log("Store Open on Weekdays")

                return  false;
            }
            else
            {
                //console.log("Store close on Weekdays")

                return true;
            }

    },



  isTakingOnlineOrder:function(isNotTakingOnlineOrder, isStoreClosed){
    //console.log('isTakingOnlineOrder:isNotTakingOnlineOrder = ' + isNotTakingOnlineOrder);
    //console.log('isTakingOnlineOrder:isStoreClosed = ' + isStoreClosed);

    if(isNotTakingOnlineOrder)
        return false;
    else
    {
        if(isStoreClosed)
        {
            return false
        }
        else
        {
            return true;
        }
    }



  } ,



    isItemInCart: function(product){

        var sessid = Session.get('appUUID');
        var orgname = Session.get(ORG_NAME_SESSION_KEY);

        var cartItems = CartItems.findOne({session: sessid, product:product, orgname:orgname});
          //console.log('isItemInCart:cartItems = ' +cartItems);

            if(cartItems)
                    return true;
            else
            return false;
    },

	menu:function(categoryMenu)
	{
        var orgname = Session.get(ORG_NAME_SESSION_KEY);
        console.log('menu: ' + orgname);

		return Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]});

	},

    soldOutCss:function(fontLine, fontStyle)
    {
        if('line-through' === fontLine || 'italic' === fontStyle)
            return 'soldout disabled';
        else
            return '';
    }

});

Template.homePage.events({
    'click .addcart': function(evt,tmpl)
    {

        var orgname = Session.get(ORG_NAME_SESSION_KEY);
        var currentTarget = evt.currentTarget
        //console.log("currentTarget" + currentTarget);
        //console.log("tmpl" + tmpl);
        //console.log("this.UniqueId " + this.UniqueId );
        var product = this.UniqueId ;
        var sessid = Session.get('appUUID');
        //console.log("product = " + product );
        //console.log("sessid = " + sessid );
        //console.log('currentTarget.title = ' + currentTarget.title);
        Meteor.call('addToCart', 1 ,product, sessid, this.Name, this.Category, this.Charge, orgname);
        evt.currentTarget.className = "btn btn btn-sm pull-right  btn-ordered removecart"; 
        evt.currentTarget.title='Remove from Cart'


    },

    'click .removecart': function(evt,tmpl)
    {
        var orgname = Session.get(ORG_NAME_SESSION_KEY);
        var currentTarget = evt.currentTarget
        //console.log("currentTarget" + currentTarget);
        //console.log("tmpl" + tmpl);
        //console.log("this.UniqueId " + this.UniqueId );
        var product = this.UniqueId ;
        var sessid = Session.get('appUUID');
        //console.log("product = " + product );
        //console.log("sessid = " + sessid );
        //console.log('currentTarget.title = ' + currentTarget.title);
        Meteor.call('removeCartItem', product, sessid, orgname);
        evt.currentTarget.className = "pull-right fa btn btn-success addcart"; 
        evt.currentTarget.title='Add to Cart'
    }


});
