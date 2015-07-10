var app = angular.module('beerApp',['ngRoute', 'firebase']);

app.config(['$routeProvider',function($routeProvider) {
	$routeProvider
		.when('/',{
			templateUrl:'templates/calculator.html',
			controller:'calculatorController'
		})
		.when('/calculator',{
			templateUrl:'templates/calculator.html',
			controller:'calculatorController'
		})
		.when('/list',{
			templateUrl:'templates/list.html',
			controller: 'listController'
		})
		.when("/edit/:id",{
			templateUrl: 'templates/edit.html',
			controller: 'editController'
		})
		.when("/login",{
			templateUrl: 'templates/login.html',
			controller: 'loginController'
		})
        .when('/profile',{
            templateUrl: 'templates/profile.html',
            controller: 'profileController'
        });
}]);

app.factory("Auth", ["$firebaseAuth",
  function ($firebaseAuth) {
      var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/");
      return $firebaseAuth(ref);
  }
]);

app.factory("User", ["Auth", "$firebase", function (Auth, $firebase) {
    var authUser = Auth.$getAuth();
    if (authUser) {
        var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/users/" + authUser.uid);
        var sync = $firebase(ref);
        return sync.$asObject();
    }
    return null;
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
		sync.$push(beer);
	}
	$scope.clear = function(){
		$scope.name = null;
		$scope.location = null;
		$scope.percentAlcohol = null;
		$scope.ounces = null;
		$scope.price = null;
	}
}]);

app.controller('listController', ["$scope", "$firebase", "Auth", function($scope, $firebase, Auth){
	var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers");
	var sync = $firebase(ref);

	$scope.sortValue = 'Name';
	$scope.reverse = false;

	$scope.order = function (sortValue) {
	    if (sortValue == $scope.sortValue) {
	        $scope.reverse = !$scope.reverse;
	    }
	    $scope.sortValue = sortValue;
	}

    $scope.showEdit = (Auth.$getAuth()) ? true: false;
    $scope.beers = sync.$asArray();

    $scope.getBeerValue = function (beer) {
        var value = (beer.percentAlcohol * beer.ounces) / beer.price;
        return Math.round(value * 10) / 10;
    };
}])

app.controller('editController', ['$scope', "$firebase", '$routeParams', '$location', function ($scope, $firebase, $routeParams, $location) {
    var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers/" + $routeParams.id);
    var sync = $firebase(ref);

    var syncObject = sync.$asObject();
    syncObject.$bindTo($scope, "beer");

    $scope.delete = function () {
        sync.$remove();
        $location.path("/list");
    };
}]);
app.controller('loginController', ["$scope", "Auth", function ($scope, Auth) {

    if (Auth.$getAuth()) {
        Auth.$unauth();
    }

    $scope.CreateNewUser = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$createUser({
            email: $scope.email,
            password: $scope.password
        }).then(function (userData) {
            $scope.message = "User created with uid: " + userData.uid;
        }).catch(function (error) {
            $scope.error = error;
        });
    };

    $scope.Login = function () {
        $scope.message = null;
        $scope.error = null;

        Auth.$authWithPassword({
            email: $scope.email,
            password: $scope.password
        }).then(function (authData) {
            $scope.message = "Logged in as:" + authData.uid;
        }).catch(function (error) {
            $scope.error = error;
        });
    }
}]);
app.controller('profileController', ['$scope', 'User', '$firebase','Auth', function ($scope, User, $firebase, Auth) {
    if (User) {
        User.$bindTo($scope, "userProfile");
    } else {
        $scope.message = "Login first to access your profile";
    }
}]);