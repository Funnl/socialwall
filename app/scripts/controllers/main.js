'use strict';

angular.module('socialwallApp')
  .controller('MainCtrl', function ($scope) {

  	$scope.photos = [];
  	$scope.$on('instagram', function(e, posts){
  		// Handle the new instragram posts
  		// something like...

  		posts.forEach(function(photo, index, arr){ // don't remember my js forEach...
  			$scope.photos.push(photo);
  			console.log("Added photo");
  			console.log(JSON.stringify(photo));
  			/*


{

   "attribution": null,

   "tags": [

      "angelhacktest"

   ],

   "location": {

      "latitude": 47.62314,

      "longitude": -122.330025

   },

   "comments": {

      "count": 0,

      "data": []

   },

   "filter": "Normal",

   "created_time": "1400362896",

   "link": "http://instagram.com/p/oHQfsKEz9x/",

   "likes": {

      "count": 0,

      "data": []

   },

   "images": {

      "low_resolution": {

         "url": "http://origincache-ash.fbcdn.net/10387770_1511899072362967_848554503_a.jpg",

         "width": 306,

         "height": 306

      },

      "thumbnail": {

         "url": "http://origincache-ash.fbcdn.net/10387770_1511899072362967_848554503_s.jpg",

         "width": 150,

         "height": 150

      },

      "standard_resolution": {

         "url": "http://origincache-ash.fbcdn.net/10387770_1511899072362967_848554503_n.jpg",

         "width": 640,

         "height": 640

      }

   },

   "users_in_photo": [],

   "caption": {

      "created_time": "1400362896",

      "text": "#angelhacktest",

      "from": {

         "username": "thekchau",

         "profile_picture": "http://images.ak.instagram.com/profiles/profile_271576230_75sq_1375628853.jpg",

         "id": "271576230",

         "full_name": "Kevin Chau"

      },

      "id": "722618811937931022"

   },

   "type": "image",

   "id": "722618811677884273_271576230",

   "user": {

      "username": "thekchau",

      "website": "",

      "profile_picture": "http://images.ak.instagram.com/profiles/profile_271576230_75sq_1375628853.jpg",

      "full_name": "Kevin Chau",

      "bio": "",

      "id": "271576230"

   }

}


  			*/
  			var dt = moment(photo.caption.created_time);
  			photo.caption.friendly_time = dt.fromNow().toString();
  			console.log(photo.images.thumbnail.url);
  			console.log(photo.images.standard_resolution.url);
  		})
  	})
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });

  angular.module('socialwallApp')
  .controller('DataController', function ($scope, $log, $rootScope) {

  	$scope.debugMessages = [];
  	var socket = io.connect('http://socialwall-api.funnl.co:80');
	//var socket = io.connect('http://localhost');
	socket.on('instagram', function(jsonString){
		$log.info("Got instagram update from api server");
		$log.info(jsonString);
		var jsonData = JSON.parse(jsonString);
		$log.info(jsonData);
		$scope.debugMessages.push(jsonData.data);

		// The Instagram data is wrapped for pagination, which we aren't using
		// so, we are just going to use the raw data
		$rootScope.$broadcast('instagram', jsonData.data);
	})
  });
