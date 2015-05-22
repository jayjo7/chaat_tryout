// Items that need to be move to config file
isPaymentEnabled        = function(orgname)
                           {
                              return 'yes';
                            }
isPaymentStripe			    = function(orgname) 
                          {
                            return 'yes';
                          }
                      
isPaymentSquare			    = 'no';
ispaymnetBrainTree		  = 'no';

isSmsEnabled            = 'yes';
isSmsTwilio             = 'yes';

isEmailEnabled          = 'yes';
isEmailMailgun          = 'yes';
isEmailSendgrid			    = 'no';

isOrderSystemEnabled    = 'no';
isOrderSystemClover     = 'no';
isOrderSystemSquare	    = 'no';
isOrderSystemLightSpeed	= 'no';

isPrinterEnabled		    = 'no';

gmt_offset              = -7;

fromEmailAddress      	= 'ChowpattyChaat@thewebsheets.com';

webmasterEmailAddress 	= 'jayjo7@hotmail.com';
webmasterPhoneNumberText= '425-777-6970';
isEmailWebmaster        = 'yes';

clientEmailAddress          = 'jayjo7@hotmail.com';
isClientEmailOrderReceived  = 'yes';
clientPhoneNumberText       = '425-777-6970';

mailGunApiKey         = 'key-1180c0836cb719598c0d9448c0a9f400';
mailGunDomain			    = 'thewebsheets.com';

stripePrivateKey		  = 'sk_test_X1Qg62lGhGHpGlZdeWrlbPAs';
stripeApiVersion		  = '2015-04-07';

websheetsUrl          = 'https://script.google.com/macros/s/AKfycbwWp0DVVcDEtGzrAf7H4x5DHfgP70r-3asuXzRg3orsH1NFfrY/exec';

twilioAccountSID      = 'ACbe19d2ad2460272ef1ecab898b20d0f3'
twilioAuthToken	      = 'f96be70770ddf5a49abb121416769dc8';
twilioFromPhoneNumber	= '+14252767772'

isSmsWebmaster        = 'yes'
isSmsClient           = 'yes';

Meteor.methods({

  getSetting:function(key, orgname)
  {
  		console.log('getSetting: Key = ' + key );
      console.log('getSetting: orgname = ' + orgname );

  		var settings = Settings.findOne({Key: key, orgname:orgname});
  		if(settings)
  		{
  			console.log('getSetting: value = ' + settings.Value );
  			return settings.Value;
  		}
  		else
  		{
  			return;
  		}
  },
  getAppSettings:function(key, orgname)
  {
  	  	console.log('getAppSettings: Key = ' + key );
        console.log('getSetting: orgname = ' + orgname );
  	  	var appSettings= AppSettings.findOne({Key: key, orgname:orgname});
  		if(settings)
  		{
  			console.log('getAppSettings: value = ' + appSettings.Value );
  			return appSettings.Value;
  		}
  		else
  		{
  			return;
  		}

  },


  getLocalTime:function()
  {
      return moment().utcOffset(Number(gmt_offset)).format('MM/DD/YYYY hh:mm:ss A');

  }


});