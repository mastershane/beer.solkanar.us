var app = angular.module('beerApp',['ngRoute', 'firebase']);

app.config(['$routeProvider',function($routeProvider) {
	$routeProvider
		.when('/',{
			templateUrl:'templates/calculator.html',
			controller :'calculatorController'
		})
		.when('/calculator',{
			templateUrl:'templates/calculator.html',
			controller :'calculatorController'
		})
		.when('/list',{
			templateUrl:'templates/list.html',
			controller: 'listController'
		})
		.when("/edit/:id",{
			templateUrl : 'templates/edit.html',
			controller : 'editController'
		})
		.when("/login",{
			templateUrl : 'templates/login.html',
			controller : 'loginController'
		});
}]);

app.controller("calculatorController", ["$scope", "$firebase","Auth", function($scope, $firebase, Auth){

	$scope.User = Auth.$getAuth();
	$scope.isAuthenticated = ($scope.User) ? true: false;

	var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers");	
	var sync = $firebase(ref);
	$scope.saveBeer = function(){
		var beer = {
			Name : $scope.name,
			Location : $scope.location,
			percentAlcohol : $scope.percentAlcohol,
			ounces : $scope.ounces,
			price : $scope.price,
			creator : $scope.User.uid
		}
		sync.$push(beer)
	}
	$scope.clear = function(){
		$scope.name = null;
		$scope.location = null;
		$scope.percentAlcohol = null;
		$scope.ounces = null;
		$scope.price = null;
	}
}]);

app.factory("Auth", ["$firebaseAuth",
  function($firebaseAuth) {
    var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/");
    return $firebaseAuth(ref);
  }
]);

app.controller('listController', ["$scope", "$firebase", "Auth", function($scope, $firebase, Auth){
	var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers");
    var sync = $firebase(ref);

    $scope.showEdit = (Auth.$getAuth()) ? true: false;
    $scope.beers = sync.$asArray();
}])

app.controller('editController', ['$scope',"$firebase", '$routeParams', '$location', function($scope, $firebase, $routeParams, $location){
	var ref =  new Firebase("https://beer-sol-kanar.firebaseio.com/beers/" + $routeParams.id);
	var sync = $firebase(ref);

	var syncObject = sync.$asObject();
	syncObject.$bindTo($scope, "beer");

	$scope.delete = function(){
		sync.$remove();
		$location.path("/list");
	};
}])
app.controller('loginController', ["$scope", "Auth", function($scope, Auth){

	if(Auth.$getAuth()){
		Auth.$unauth();
	}

	$scope.CreateNewUser = function() {
		$scope.message = null;
		$scope.error = null;

		Auth.$createUser({
			email: $scope.email,
			password: $scope.password
		}).then(function(userData) {
			$scope.message = "User created with uid: " + userData.uid;
		}).catch(function(error) {
			$scope.error = error;
		});
	};

	$scope.Login = function(){
		$scope.message = null;
		$scope.error = null;

		Auth.$authWithPassword({
			email: $scope.email,
			password: $scope.password
		}).then(function(authData) {
			$scope.message = "Logged in as:" + authData.uid;
		}).catch(function(error) {
			$scope.error = error;
		});
	}
}])