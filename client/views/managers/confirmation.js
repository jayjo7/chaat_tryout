Template.confirmation.helpers({
  haveETA: function(uniqueId)
  {
      console.log('isReady:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);
      

  },

	isReady: function(uniqueId)
  {
      console.log('isReady:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      if(STATE_THREE === order.Status)
        	return true;
      else
        	return false;
  },

  isDelivered: function(uniqueId)
  {
      console.log('isDelivered:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      if('delivered' === order.Status)
        	return true;
      else
        	return false;
  },

  isInProcess: function(uniqueId)
  {
      console.log('isInProcess:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      if( STATE_TWO === order.Status)
        	return true;
      else
        	return false;

  },

  isInKitchen: function(uniqueId)
  {
      console.log('isInKitchen:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      if( STATE_TWO === order.Status || STATE_FOUR === order.Status || STATE_THREE === order.Status)
        	return true;
      else
        	return false;
  },
  isSaleComplete: function(uniqueId)
  { 
      console.log('isSaleComplete:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      if( STATE_FOUR === order.Status || STATE_THREE === order.Status)
        	return true;
      else
        	return false;
  },

  order: function(uniqueId)
  {
      console.log('order:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);
      return Orders.findOne({UniqueId:uniqueId, orgname:orgname});
  },

  customerName: function(uniqueId)
  {
      console.log('customerName:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      return order.CustomerName;
  },

  message: function(uniqueId)
	{
		  console.log('message:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      var messageKey='message_confirmation';
      if(STATE_THREE === order.Status)

          messageKey = 'message_ready';
      else
		  if(STATE_FOUR === order.Status)

        messageKey = 'message_delivered';


		  var confirmation = Settings.findOne({$and : [{Key: messageKey}, {UniqueId:uniqueId}, {Value : {"$exists" : true, "$ne" : ""}}]});

		  var value = confirmation['Value'];
		  console.log(' confirmation value = ' + value);

		  var confirmationArray = value.split('\n\n' );

		  for(key in confirmationArray)
		  {
		      console.log(key + " = " + confirmationArray[key]);
		  }

		  return confirmationArray;

	},

  orderNumber: function(uniqueId)
  {  
      console.log('orderNumber:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      return order.OrderNumber;

  },

  orderedCart: function(uniqueId)
  {
    var orgname = Session.get(ORG_NAME_SESSION_KEY);

    return OrderedItems.find({UniqueId:uniqueId, orgname:orgname});
  },

  haveTax:function(uniqueId)
  {
      console.log('haveTax:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return validData(orderMeta.tax);

  },

  getDiscount:function(uniqueId)
  {
      var orgname = Session.get(ORG_NAME_SESSION_KEY);
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.discount).toFixed(2);
  },

  getSubTotal:function(uniqueId)
	{
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
		  return '$'+Number(orderMeta.SubTotal).toFixed(2);
	},
    
  getTax:function(uniqueId)
  {
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.tax).toFixed(2);
	},

  getTotal:function(uniqueId)
	{
      var orgname = Session.get(ORG_NAME_SESSION_KEY);

      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return '$'+Number(orderMeta.Total).toFixed(2);
	},

  currency: function(num)
  {
      return '$' + Number(num).toFixed(2);
  },

  haveMessageToKitchen: function(uniqueId)
  {
      var orgname = Session.get(ORG_NAME_SESSION_KEY);
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      return validData(order.MessageToKitchen);

  },

  messageToKitchen: function(uniqueId)
  {
      var orgname = Session.get(ORG_NAME_SESSION_KEY);    
      var order = Orders.findOne({UniqueId:uniqueId, orgname:orgname});
      return order.MessageToKitchen;
  },

  haveDiscount:function(uniqueId)
  {
      console.log('haveDiscount:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return validData(orderMeta.discount);

  },

  showSubTotal:function(uniqueId)
  {
      console.log('showSubTotal:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      if(orderMeta.tax || orderMeta.discount)
        return true;
      else
        return  false;
  },

  getPaymentOption:function(uniqueId)
  {
      console.log('getPaymentOption:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY);      
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return orderMeta.Payment;

  },

  isOrderStatusAlert:function(uniqueId)
  {
      var orgname = Session.get(ORG_NAME_SESSION_KEY);  
      console.log('isOrderStatusAlert:uniqueId = ' + uniqueId);
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      if(orderMeta.orderStatusAlert)
      {
        return true;
      }
      else
      {
        return false;
      }
  },

  getOrderStatusAlert:function(uniqueId)
  {
      console.log('getOrderStatusAlert:uniqueId = ' + uniqueId);
      var orgname = Session.get(ORG_NAME_SESSION_KEY); 
      var orderMeta = OrdersMeta.findOne({UniqueId:uniqueId, orgname:orgname});
      return orderMeta.orderStatusAlert;
  }


});