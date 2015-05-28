NOTIFICATION_MESSAGE_KEY = 'notification_message';
var notificationkey = Session.get(ORG_NAME_SESSION_KEY) + '_' + NOTIFICATION_MESSAGE_KEY;


Template.homePage.helpers({


    notification_message_session:function()
    {

        return Session.get(notificationkey);

    },

    haveNotification: function(notification_general,isNotTakingOnlineOrder, isStoreClosed)
    {


        var orgname = Session.get(ORG_NAME_SESSION_KEY);


        if(isNotTakingOnlineOrder)
        {        
                var settings = Settings.findOne({$and : [{Key: "notification_no_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]})

                var settingsValue = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();

                var settingsArray=[];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

                Session.set(notificationkey, settingsArray);

                return true;
        }

        if(isStoreClosed)
        {

                var settings        = Settings.findOne({$and : [{Key: "notification_store_closed"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]})
                var settingsValue   = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();

                var settingsArray = [];

                if(settingsValue.trim().length> 0)
                {
                    settingsArray = settingsValue.split('\n\n' );

                }

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

                var settingsValue       = settings['Value'];
                var settingsValueTrimed = settingsValue.trim();
                var settingsArray       =[];


                if(settingsValue.trim().length> 0)
                {

                    settingsArray = settingsValue.split('\n\n' );

                }

                return settingsArray;
            

    },

    isNotTakingOnlineOrder: function()
    {
        var orgname = Session.get(ORG_NAME_SESSION_KEY);

        var store_online_orders= Settings.findOne({$and : [{Key: "store_online_orders"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

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

            var momentDate=moment().utcOffset(Number(gmtOffset(orgname)));
            var currentday =momentDate.day();
            var currentTime =momentDate.hour();



            if (currentday === 0  || (currentday === 6)) //Sunday
            {
                var store_open_saturday     = Settings.findOne({$and : [{Key: "store_open_saturday"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                var store_open_sunday       = Settings.findOne({$and : [{Key: "store_open_sunday"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});

                if( 'NO'=== store_open_sunday.Value.trim().toUpperCase() || 'NO'=== store_open_saturday.Value.trim().toUpperCase() )
                {
                    return true;
                }
                else
                {
                    var store_open_time_weekend = Settings.findOne({$and : [{Key: "store_open_time_weekend"}, {orgname:orgname}, {Value : {"$exists" : true, "$ne" : ""}}]});
                    var store_close_time_weekend= Settings.findOne({$and : [{Key: "store_close_time_weekend"},{orgname:orgname},  {Value : {"$exists" : true, "$ne" : ""}}]});

                    if(currentTime >= store_open_time_weekend.Value  &&  currentTime < store_close_time_weekend.Value)
                    {

                        return  false;
                    }
                    else
                    {

                        return true;
                    }


                }

            }

            if(currentTime >= store_open_time.Value  &&  currentTime < store_close_time.Value)
            {

                return  false;
            }
            else
            {

                return true;
            }

    },



  isTakingOnlineOrder:function(isNotTakingOnlineOrder, isStoreClosed)
  {

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



    isItemInCart: function(product)
    {

        var sessid = Session.get('appUUID');
        var orgname = Session.get(ORG_NAME_SESSION_KEY);

        var cartItems = CartItems.findOne({session: sessid, product:product, orgname:orgname});

            if(cartItems)
                    return true;
            else
            return false;
    },

	menu:function(categoryMenu)
	{
        var orgname = Session.get(ORG_NAME_SESSION_KEY);
        console.log('menu: ' + orgname);

		return Menu.find({$and : [{Category: categoryMenu}, {orgname:orgname}, {Name : {"$exists" : true, "$ne" : ""}}]},{sort:{sheetRowId: 1}});

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

        var orgname         = Session.get(ORG_NAME_SESSION_KEY);
        var currentTarget   = evt.currentTarget
        var product         = this.UniqueId ;
        var sessid           = Session.get('appUUID');
        Meteor.call('addToCart', 1 ,product, sessid, this.Name, this.Category, this.Charge, orgname);
        evt.currentTarget.className = "btn btn btn-sm pull-right  btn-ordered removecart"; 
        evt.currentTarget.title='Remove from Cart'


    },

    'click .removecart': function(evt,tmpl)
    {
        var orgname         = Session.get(ORG_NAME_SESSION_KEY);
        var currentTarget   = evt.currentTarget
        var product         = this.UniqueId ;
        var sessid          = Session.get('appUUID');
        Meteor.call('removeCartItem', product, sessid, orgname);
        evt.currentTarget.className = "pull-right fa btn btn-success addcart"; 
        evt.currentTarget.title='Add to Cart'
    }


});
