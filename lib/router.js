Router.configure({
	layoutTemplate: 'layout',
	loadingTemplate: 'loading'
	});
	


Router.route('/',   {
						name: 'homePage',
						waitOn:  function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
									Meteor.subscribe('menu' , ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content' , ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings' , ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
							        Meteor.subscribe('cartItems', appUUID , ORG_NAME);
		        					console.log(appUUID + ':done subscribing to cartItems...');					        	        					

								}
});

Router.route('/home',   {
						name: 		'home',
						template:  	'homePage',
						waitOn: function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
									Meteor.subscribe('menu' , ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content' , ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings' , ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
							        Meteor.subscribe('cartItems', appUUID , ORG_NAME);
		        					console.log(appUUID + ':done subscribing to cartItems...');					        	        					

								}
});

Router.route('/om', 
					{
						layoutTemplate: 'layoutOrderManagement',
						name: 			'orderManagement',
				 		waitOn:  function()
				 						{ 
											Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
				 							Meteor.subscribe('settings', 				ORG_NAME);	  
				 							Meteor.subscribe('orderManagement', 		ORG_NAME);
				 							Meteor.subscribe('ordereditemsManagement',  ORG_NAME);
										}
			});


Router.route('/dm', {
						layoutTemplate:'layoutDigitalMenu', 
						name: 'digitalMenu',
						waitOn:  function()
								{
									var appUUID = Session.get('appUUID');
									Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
									Meteor.subscribe('menu',  ORG_NAME);	       
		        					console.log(appUUID + ':done subscribing to menu...');
							        Meteor.subscribe('content',  ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to content...');	
							        Meteor.subscribe('settings',  ORG_NAME);	       
							        console.log(appUUID + ':done subscribing to settings...');		
					        	     Meteor.subscribe('orderManagement', 		ORG_NAME);
				
								}						

					});

Router.route('/os/:UniqueId', 
					{
						layoutTemplate: 'layoutOrderConfirmation',
						name: 			'os',
						template:  		'confirmation',
				 		data: function()
				 						{ 
				 							var appUUID = Session.get('appUUID');
				 							console.log("router /os = " +  ORG_NAME );
									        Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
				 							Meteor.subscribe('settings', ORG_NAME);	  
				 							console.log(appUUID + ':done subscribing to settings...');
				 							Meteor.subscribe('ordereditems', this.params.UniqueId,  ORG_NAME);
				 							console.log(appUUID + ':done subscribing to ordereditems...');
				 						    Meteor.subscribe('orders', this.params.UniqueId, ORG_NAME);
				 						    console.log(appUUID + ':done subscribing to orders...');
				 						    Meteor.subscribe('ordersMeta', this.params.UniqueId, ORG_NAME);
				 						   	console.log(appUUID + ':done subscribing to ordersMeta...');
				 							return {UniqueId: this.params.UniqueId}

										}
			});

Router.route('/confirmation/:UniqueId', 
					{
						layoutTemplate: 'layoutOrderConfirmation',
						name: 			'confirmation',
						template:  		'confirmation',
				 		data:			function()
				 						{ 
											Session.setPersistent(ORG_NAME_SESSION_KEY, ORG_NAME);
				 							Meteor.subscribe('settings', ORG_NAME);	       
				 							Meteor.subscribe('ordereditems', this.params.UniqueId , ORG_NAME);
				 						    Meteor.subscribe('orders', this.params.UniqueId , ORG_NAME);
				 						    Meteor.subscribe('ordersMeta', this.params.UniqueId , ORG_NAME);
				 							return {UniqueId: this.params.UniqueId}

										}
			});








	
	
	


