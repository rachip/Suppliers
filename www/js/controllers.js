var widthArr = [60, 40, 50];
var TheBranchName;
localStorage.setItem("isLoggedin", "false");
localStorage.setItem('msNum', 0);
angular.module('starter.controllers', ['firebase', 'ngSanitize','ngFileUpload'])
//var app = angular.module('fileUpload', ['ngFileUpload']);
.controller('AuthCtrl', function($scope, $ionicConfig) {

})

// APP
.controller('AppCtrl', function($scope, $location, $state, $ionicConfig, $rootScope, $http, $ionicPopup) {

	$scope.selectChat = function() {
		//console.log('click chat ' + $rootScope.propertyCnt);
		$state.go('chatMain');
	}  
})

// Invest
.controller('InvestCtrl', function($scope, $state) {
	
	$scope.sideMenuNavigation = function() {
		if(localStorage.getItem("email") != null) {
			$state.go('app.overview');
		} else
			$state.go('auth.main');
	}  
})

//LOGIN
.controller('LoginCtrl', function($scope, $rootScope, $http, $state, $location) {

	$scope.errorLogin = 0;
    
    $scope.investMe = function() {
	    $state.go('invest.marketing');
    };

    $scope.userDetail = {};
	
	if(localStorage.getItem("email") != null) {
		$scope.userDetail.email = localStorage.getItem("email");
		$scope.userDetail.password = localStorage.getItem("password");
	}

	$scope.submit = function() {
		$scope.isLogin = true;
	    $http({
	    	url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/Login', 
		    method: "POST",
		    data:  {mail:$scope.userDetail.email,
		    	    password:$scope.userDetail.password}, 
		    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		    
		}).then(function(resp) {
			if(resp.data == "false") {
				$scope.isLogin = false;	
				$scope.msg = "The Email or Password incorrect";
				$scope.errorLogin = 1;
			}
			else {
				localStorage.setItem("id", resp.data["SupplierId"]);
				localStorage.setItem("branch", resp.data["BranchId"]);
				localStorage.setItem("email", $scope.userDetail.email);
				localStorage.setItem("password", $scope.userDetail.password);
				localStorage.setItem("isLoggedin", "true");
				
				//var deviceToken = localStorage.getItem("deviceToken");

				/*$http({
				    url: 'http://updateme.co.il/index.php/Supplier/api/Login/setDeviceToken', 
				    method: "POST",
				    data:  {Userid: resp.data["SupplierId"],
						    DeviceToken: deviceToken,
						    IsconnectToApp: 1}, 
				    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
				    
				}).then(function(resp) {

					//console.log(resp);

					});*/
				$scope.isLogin = false;	
				$state.go('app.properties');	
			}				
		}, function(err) {
			$scope.isLogin = false;	
		    $scope.msg = err;
		    console.error('ERR', err);
		})
    };
})

//Chats Ctrl
.controller('ChatsCtrl', function($scope, NewChatsService, getAllChats, $ionicHistory, $location, $state, $rootScope, $firebaseObject ,$firebaseArray, $ionicScrollDelegate, $rootScope ) { 
	
	$scope.branchToChat = function (BranchName) { 
		TheBranchName = BranchName;	
	 	$scope.chatSelected = false;  
	 	$state.go('app.chats'); 
	} 
	
	var userId = localStorage.getItem("id"); 
	$scope.userId = userId;
	$scope.RochesterChat = check_new_chatc($firebaseObject ,$firebaseArray, "Rochester", userId);
	$scope.ClevelandChat = check_new_chatc($firebaseObject ,$firebaseArray, "Cleveland", userId);
	$scope.ColumbusChat = check_new_chatc($firebaseObject ,$firebaseArray, "Columbus", userId);
	
	$scope.show_chat_bu = true;
	
	$scope.myBackBU = function() {			
		$scope.show_chat_bu = true;
		$ionicHistory.goBack();
	}

  	$scope.chatIsActive = false; 
 
  	$scope.myId = localStorage.getItem("id"); 
 	var userId = localStorage.getItem("id"); 
 
 	var ref = new Firebase("https://updatemeapp.firebaseio.com/messages/" + TheBranchName + "/" + userId); 
 
	ref.limitToLast(1).on("child_added", function(snapshot, prevChildKey) { 
	 	$ionicScrollDelegate.scrollBottom(); 
	 	$ionicScrollDelegate.scrollBottom(); 
 	}); 
 
 	$scope.chats = $firebaseArray(ref); 
 
  	var username = localStorage.getItem("ClientName"); 
  	
  	$ionicScrollDelegate.scrollBottom(); 
   
 	$scope.sendChat = function(chat) { 
   		$scope.chats.$add({ 
 			user: username, 
 			userid: userId, 
 	        message: chat.message, 
 	        client: true, 
 	        timestamp: new Date().getTime() 
 		}); 
 		chat.message = ""; 
 	} 
    
    $scope.isEmpty = function (obj) {
    	//console.log("obj "+ obj);
        if (obj == "") 
        	return false;
        else
        	return true;
    };
}) 

//Properties Ctrl - logged in user
.controller('PropertiesCtrl', function($scope, $location, getAllChats, notService, NewChatsService, $http, $location, $ionicPopup, $timeout, $firebaseObject ,$firebaseArray, $rootScope, $state, $q, $ionicScrollDelegate) {
	
	/*notService.getNewNote();

	$scope.chatsTitle = getAllChats.get();
	
    $scope.msNum = localStorage.getItem('msNum');

    $scope.setNewM = function(num, value) {
		if (value == true) {
			$scope.msNum ++;
		}        
    }
		
	$scope.show_chat_bu = true;
		
	$scope.hide_chat_box = function() {			
		$scope.chatSelected = false;			
	}

	$scope.branchToChat = function (BranchName) { 
		TheBranchName = BranchName;	
	 	$scope.chatSelected = false;  
	 	$state.go('app.chats'); 
	} 
	 
	$scope.selectChat = function() { 
 		localStorage.setItem('msNum', 0);
 		 $scope.msNum = localStorage.getItem('msNum');
 
 		if ($rootScope.propertyCnt > 1 ) { 
 			$state.go('app.chatMain'); 
 		} else { 
 			TheBranchName = $rootScope.TheBranchName;
 			$state.go('app.chatMain'); 
 		} 
 	}*/  		
		
    var id; 
    $scope.isPropertiesLoading = true;    
    
    $scope.init = function() {
    	var promise = getPropertiesPageData($scope, $rootScope, $http, $q);
		promise.then(function() {
		}, function() {
			alert('Failed: ');
		});
		
		$ionicScrollDelegate.scrollTop();
    }
    
	$scope.showPropertyDetails = function(propertyId, imageURL) {
		$state.go('app.propertyDetails');
	    $timeout(function() {
	    	var unbind = $rootScope.$broadcast( "showDetails", {PropertyId:propertyId, ImageURL:imageURL} );
	    });
	};
})

//propertyDetails ctrl
.controller('PropertyDetailsCtrl',function($scope, getAllChats, $location, $firebaseObject ,$firebaseArray, $ionicPopup, $state, $rootScope, $ionicScrollDelegate, $http, $rootScope, 
		$timeout, $q, $ionicPopup, $ionicModal,Upload) {
	
	//uploud
    $scope.uploadFiles = function(files, errFiles) {
        $scope.files = files;
        $scope.errFiles = errFiles;
        angular.forEach(files, function(file) {
            file.upload = Upload.upload({
                url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/GetFiles/addPaymentFileApi',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 * 
                                         evt.loaded / evt.total));
            });
        });
    }
////	
	//
	$scope.chatsTitle = getAllChats.get();
	
    $scope.msNum = localStorage.getItem('msNum');

    $scope.setNewM = function(num, value) {
		if (value == true) {
			$scope.msNum ++;
		}        
    }

	$http({
	   url: 'http: //ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing/getClientNotification', 
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
	
			$http({
			    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/Marketing/setClientNotificationStatus', 
			    method: "POST",
			    data: { NotificationId: NotificationId},
			    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).then(function(resp) {
				//console.log("sucess")
			}, function(err) {
			    console.error('ERR', err);
			})	
		}
	}, function(err) {	    
	});
	
	$scope.hide_chat_box = function() {		
		$scope.chatSelected = false;		
	}

	$scope.branchToChat = function (BranchName) { 
		TheBranchName = BranchName;	
	 	$scope.chatSelected = false;  
	 	$state.go('app.chatMain'); 
	} 
 
	$scope.selectChat = function() { 
 		localStorage.setItem('msNum', 0);
 		 $scope.msNum = localStorage.getItem('msNum');
 		if ($rootScope.propertyCnt > 1 ) { 
 			$state.go('app.chatMain'); 
 		} else { 
 			TheBranchName = $rootScope.TheBranchName;
 			$state.go('app.chatMain'); 
 		} 
 	}  
	
	$rootScope.isPropertyDetailsLoading = true;
	
	var propertyId;
	$scope.$on( "showDetails", function(event, data) {
		propertyId = data.PropertyId;
		var promise = getOverviewDetailsPageData(propertyId, $scope, $http, $q);
		promise.then(function() {
		}, function() {
			alert('Failed: ');
		});				
	});
	
	
	$ionicModal.fromTemplateUrl('my-modal.html', {
	    scope: $scope,
	    animation: 'slide-in-up'
	  }).then(function(modal) {
	    $scope.modal = modal;
	  });
	 $scope.openModal = function(typeId,kind,workOrder) {
		//var ref = cordova.InAppBrowser.open('http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/uploads/thumb_14626903231450773143download.jpg', '_blank', 'location=yes');
		 $scope.modal.show();	
		 $http({
			    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/GetFiles/getPropertyFile', 
			    method: "GET",
			    params:  {propertyId: propertyId, typeId: typeId, kind: kind, workOrder: workOrder}, 
			    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
			}).then(function(resp) {
				console.log(resp);
				console.log("111");
				console.log($scope.title);
				$scope.sliderImg = resp.data;
				$scope.title = "gudtud";
				if (resp.data.length != 0) {
					for(var i = 0; i < $scope.sliderImg.length; i++) {
						$scope.sliderImg[i].Date = dateFormat($scope.sliderImg[i].Date);
					}
					
					
				} 		
			}, function(err) {
			    console.error('ERR', err);
			})
	  };
	  
	  $scope.closeModal = function() { 
		  $scope.sliderImg = null;
		  $scope.modal.hide();
	  };
	  // Cleanup the modal when we're done with it!
	  $scope.$on('$destroy', function() {
	    $scope.modal.remove();
	  });
	  // Execute action on hide modal
	  $scope.$on('modal.hidden', function() {
	    // Execute action
	  });
	  // Execute action on remove modal
	  $scope.$on('modal.removed', function() {
	    // Execute action
	  });
})

function addClass(data) {
	var length = data.length;
	var rndvalKodem;
	var rndval;
	
	//----------------------
	//add col- class
	if(data.length % 2 != 0) {
		data[data.length - 1].class = "col-100";
		length -= 1;
	}
	
	rndvalKodem = 0;
	for(var i = 0; i < length; i+=2) {
		do {
			rndval = widthArr[Math.floor(Math.random()*widthArr.length)];
		} while (rndval == rndvalKodem);
		rndvalKodem = rndval;				
		data[i].class = "col-" + rndval;
		rndval = 100 - rndval;
		data[i+1].class = "col-" + rndval;
	}
	
	//----------------------
	//add desaturate class
	for(var i = 0; i < data.length; i++) {
		if(data[i]["IsSoled"] == 1) {
			data[i].class += " desaturate";
		}
	}
}

//set short name to property, just the street
function setShortName(data) {
	if(data) {
		for(var i = 0; i < data.length; i++) {			
			data[i]["PropertyName"] = SplitName(data[i]["PropertyName"]);
		}
	}
}

//get properties for 'your properties' section
function getPropertiesForYourPropertiesSection($scope, $rootScope, $http) {		
	url = 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/PropertyImage/getPropertiesForYourProperties';
	id = localStorage.getItem('id');
	return $http({
	    url: url, 
	    method: "GET",
	    params:  {index:id}, 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {

		$scope.propertyImage = [];
		$scope.propertyImage = resp.data;
		
		$rootScope.propertyCnt = resp.data.length;
		
		// set default image to property in case that no image attached.
		for(var i = 0; i < $scope.propertyImage.length; i++) {
			if($scope.propertyImage[i].FileName == null) {
				$scope.propertyImage[i].FileName = "defaultProperty.jpg";
			}
		}
		
		addClass($scope.propertyImage);
		setShortName($scope.propertyImage);
		
	}, function(err) {
	    console.error('ERR', err);
	})
}

function getPropertiesPageData($scope, $rootScope, $http, $q) {	 
	return $q.all([getPropertiesForYourPropertiesSection($scope, $rootScope, $http)]).
	                then(function(results) {
		$scope.isPropertiesLoading = false;
	});
}

function SplitName(str) {
	var array = str.split(',');
	return array[0];
}

function updateClientRead($http, propertyId, section) {
	$http({
	    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/api/' + section + '/updateClientRead', 
	    method: "GET",
	    params:  {index: propertyId}, 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {
			
	}, function(err) {
	    console.error('ERR', err);
	});
}

function check_new_chatc($firebaseObject ,$firebaseArray, branchName, thisUserId) {
	var ref = new Firebase("https://updatemeapp.firebaseio.com/messages/" + branchName + "/" + thisUserId);
	chats = $firebaseArray(ref);

	return chats;
}

function get_new_not($http) {
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
		}
		
	}, function(err) {
	    
	});
}
	
	////

function getMaintenanceDetails(propertyId, $scope, $http) {	
	return $http({
	    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/Maintenance', 
	    method: "GET",
	    params:  {index: propertyId}, 
	    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
	}).then(function(resp) {
		if (resp.data.length != 0) {
			$scope.maintenanceObg = [];
			$scope.maintenanceObg = resp.data;
			for(var i = 0; i < $scope.maintenanceObg.length; i++) {
				$scope.maintenanceObg[i].Date = dateFormat($scope.maintenanceObg[i].Date);
				if($scope.maintenanceObg[i].FileName == null) {
					$scope.maintenanceObg[i].FileName  = "defaultProperty.jpg";	
				}
			}
			
		} 		
	}, function(err) {
	    console.error('ERR', err);
	})
}
	function getRenovationDetails(propertyId, $scope, $http) {
		$scope.isRenovation =false;
		return $http({
		    url: 'http://ec2-52-32-92-71.us-west-2.compute.amazonaws.com/index.php/Supplier/api/Renovation', 
		    method: "GET",
		    params:  {index:propertyId}, 
		    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		}).then(function(resp) {
			if (resp.data.length != 0) {
				$scope.isRenovation = true;
				$scope.renovation = resp.data[0];
			    $scope.renovation['StartDate'] = dateFormat($scope.renovation['StartDate']);
			    $scope.renovationFileName=$scope.renovation['FileName'];
			    if($scope.renovation['FileName'] == null) {
			        $scope.renovationFileName = "defaultProperty.jpg";	
			       }
			    console.log($scope.renovationFileName);
				} 
		}, function(err) {
		    console.error('ERR', err);
		})
	}
	
	function getOverviewDetailsPageData(propertyId, $scope, $http, $q) {
		return $q.all([getMaintenanceDetails(propertyId, $scope, $http),
		               getRenovationDetails(propertyId, $scope, $http)]).
		                then(function(results) {
			$scope.isPropertyDetailsLoading = false;
		});
	}
	
	function dateFormat(date) {
		var formattedDate = new Date(date);
		return isNaN(formattedDate.getMonth())  ?"": (formattedDate.getMonth() + 1) + '/' + formattedDate.getDate() + '/' +  formattedDate.getFullYear();
	}
////////test
	/*.controller('CameraCtrl', function ($scope) {        
	     $scope.takePic = function() {
	        var options =   {
	            quality: 50,
	            destinationType: Camera.DestinationType.FILE_URI,
	            sourceType: 1,      // 0:Photo Library, 1=Camera, 2=Saved Photo Album
	            encodingType: 0     // 0=JPG 1=PNG
	        }
	        navigator.camera.getPicture(onSuccess,onFail,options);
	    }
	    var onSuccess = function(FILE_URI) {
	        console.log(FILE_URI);
	        $scope.picData = FILE_URI;
	        $scope.$apply();
	    };
	    var onFail = function(e) {
	        console.log("On fail " + e);
	    }
	    $scope.send = function() {   
	        var myImg = $scope.picData;
	        var options = new FileUploadOptions();
	        options.fileKey="post";
	        options.chunkedMode = false;
	        var params = {};
	        params.user_token = localStorage.getItem('auth_token');
	        params.user_email = localStorage.getItem('email');
	        options.params = params;
	        var ft = new FileTransfer();
	        ft.upload(myImg, encodeURI("https://example.com/posts/"), onUploadSuccess, onUploadFail, options);
	    }
	    
	//////*/

///////getPicture uploud image 

	/*	getPicture: function (options) {
		    var q = $q.defer();
		 
		    navigator.camera.getPicture(function (result) {
		        // Do any magic you need
		        q.resolve(result);
		    }, function (err) {
		        q.reject(err);
		    }, options);
		 
		    return q.promise;
		},
		
		resizeImage: function (img_path) {
		    var q = $q.defer();
		    window.imageResizer.resizeImage(function (success_resp) {
		        console.log('success, img re-size: ' + JSON.stringify(success_resp));
		        q.resolve(success_resp);
		    }, function (fail_resp) {
		        console.log('fail, img re-size: ' + JSON.stringify(fail_resp));
		        q.reject(fail_resp);
		    }, img_path, 200, 0, {
		        imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
		        resizeType: ImageResizer.RESIZE_TYPE_MIN_PIXEL,
		        pixelDensity: true,
		        storeImage: false,
		        photoAlbum: false,
		        format: 'jpg'
		    });
		 
		    return q.promise;
		},
		
		toBase64Image: function (img_path) {
		    var q = $q.defer();
		    window.imageResizer.resizeImage(function (success_resp) {
		        console.log('success, img toBase64Image: ' + JSON.stringify(success_resp));
		        q.resolve(success_resp);
		    }, function (fail_resp) {
		        console.log('fail, img toBase64Image: ' + JSON.stringify(fail_resp));
		        q.reject(fail_resp);
		    }, img_path, 1, 1, {
		        imageDataType: ImageResizer.IMAGE_DATA_TYPE_URL,
		        resizeType: ImageResizer.RESIZE_TYPE_FACTOR,
		        format: 'jpg'
		    });
		 
		    return q.promise;
		}
		savePhotoToParse: function (_params) {
		    var ImageObject = Parse.Object.extend("ImageInfo");
		 
		    // create the parse file object using base64 representation of photo
		    var imageFile = new Parse.File("mypic.jpg", {base64: _params.photo});
		 
		 
		    // save the parse file object
		    return imageFile.save().then(function () {
		 
		        _params.photo = null;
		 
		        // create object to hold caption and file reference
		        var imageObject = new ImageObject();
		 
		        // set object properties
		        imageObject.set("caption", _params.caption);
		        imageObject.set("picture", imageFile);
		 
		        // save object to parse backend
		        return imageObject.save();
		 
		    }, function (error) {
		        alert("Error " + JSON.stringify(error, null, 2));
		        console.log(error);
		    });
		 
		}
		
		
		////////*/