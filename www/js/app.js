// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js

var	is_new;

angular.module('starter', ['ionic', 'ngCordova', 'starter.controllers', 'starter.services', 'firebase', 'ionicLazyLoad', 'starter.controllers'])


.run(function() {
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
})

.service('myService', function ($interval) {
    this.ChangeTest = function (data) {
        $interval(function () {
            if (data.Test == 'Test') data.Test = 'Changed Test';
            else data.Test = 'Test';
        },500);
    }
})

.service('numOfChatsServ', function () {    	
	msNum = 0;
        
    this.set = function(num, value) {
		if (value == true) {
			msNum = msNum + num;
		}        
    }
        
    this.get = function () {    	
    	return msNum;    	
    }
})

.service('NewChatsService', function () {
	
	this.is_new;

    this.set = function (data) {
    	this.is_new = data;
    }, 
        
    this.get = function() {    	
    	return this.is_new;    	
    }
})

.service('getAllChats', function ($firebaseObject ,$firebaseArray, $interval, $rootScope, $http) {

	this.get = function (UserId) {

		var chatsTitle = {};
	
		var userId = localStorage.getItem("id"); 
		userId = userId;
	
		var ref1 = new Firebase("https://updatemeapp.firebaseio.com/messages/Rochester/" + userId);
		var ref2 = new Firebase("https://updatemeapp.firebaseio.com/messages/Columbus/" + userId);
		var ref3 = new Firebase("https://updatemeapp.firebaseio.com/messages/Cleveland/" + userId);
	
	    chatsTitle.Rochester = $firebaseArray(ref1);
	    chatsTitle.Columbus = $firebaseArray(ref2);
	    chatsTitle.Cleveland = $firebaseArray(ref3);
	    console.log(chatsTitle);
	    	    
		return chatsTitle;
	}
})

.service("notService", function($http, $interval, $ionicPopup, $state) {
	
	 this.getNewNote = function() {
		 
	$interval(function(){
		
		if (localStorage.getItem("id") != null ) {
	
	$http({
	    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing/getClientNotification', 
	    method: "GET",
	    params:  { index: localStorage.getItem("id")}, 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {
		
		
		if (resp.data.length != 0) {
		
		text = resp.data[0]['Text'];
		NotificationId = resp.data[0]['Id'];
		
		  var alertPopup = $ionicPopup.alert({
			   title: 'New message from ME',
			     template: text
			   });
		  
		  alertPopup.then(function(res) {
			  $state
			   });

				$http({
				    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing/setClientNotificationStatus', 
				    method: "POST",
				    data: { NotificationId: NotificationId},
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				}).then(function(resp) {
					console.log("sucess")
				}, function(err) {
				    console.error('ERR', err);
				})	
				
				 $state.go('app.overview');
		   
		}
		
	}, function(err) {
	    
	})
	
	}
	
	}, 500);
	
	 }
})

.directive('input', function($timeout) {
  return {
    restrict: 'E',
    scope: {
      'returnClose': '=',
      'onReturn': '&',
      'onFocus': '&',
      'onBlur': '&'
    },
    link: function(scope, element, attr) {
      element.bind('focus', function(e) {
        if (scope.onFocus) {
          $timeout(function() {
            scope.onFocus();
          });
        }
      });
      element.bind('blur', function(e) {
        if (scope.onBlur) {
          $timeout(function() {
            scope.onBlur();
          });
        }
      });
      element.bind('keydown', function(e) {
        if (e.which == 13) {
          if (scope.returnClose) element[0].blur();
          if (scope.onReturn) {
            $timeout(function() {
              scope.onReturn();
            });
          }
        }
      });
    }
  }
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
  
  .state('auth', {
    url: "/auth",
    templateUrl: "views/auth/auth.html",
    abstract: true,
    controller: 'AuthCtrl'
  })
  
  .state('auth.main', {
    url: '/main',
    templateUrl: "views/auth/main.html",
    controller: 'LoginCtrl'
  })
  
  .state('app', {
    url: "/app",
    templateUrl: "views/app/template.html",
    abstract: true,
    controller: 'ChatsCtrl'
  })
  
  //overview
  .state('app.properties', {
    url: "/properties",
    views: {
    	'menuContent': {
		  templateUrl: "views/app/properties.html",
		  controller: 'PropertiesCtrl'
    	}
    }
  })
  
  //property details
  .state('app.propertyDetails', {
    url: "/propertyDetails",
    views: {
    	'menuContent': {
    		templateUrl: "views/app/propertyDetails.html",
    		controller: 'PropertyDetailsCtrl'
    	}
    }
  })

 .state('app.chatMain', {
    url: '/chatMain',
    views: {
       'menuContent': {
    	   templateUrl: 'templates/chatsMain.html',
    	   controller: 'ChatsCtrl'
    		   
       }
    }
  })

 .state('app.chats', {
	 url: '/chats',
	    views: {
	        'menuContent': {
	    	templateUrl: 'templates/tab-chats.html',
            controller: 'ChatsCtrl'	
	        }
	    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/auth/main');

});
