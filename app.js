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
		});
}]);

app.controller("calculatorController", ["$scope", "$firebase", function($scope, $firebase){

	var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers");	
	var sync = $firebase(ref);
	$scope.saveBeer = function(){
		var beer = {
			Name : $scope.name,
			Location : $scope.location,
			percentAlcohol : $scope.percentAlcohol,
			ounces : $scope.ounces,
			price : $scope.price
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

app.controller('listController', ["$scope", "$firebase", function($scope, $firebase){
	var ref = new Firebase("https://beer-sol-kanar.firebaseio.com/beers");
    var sync = $firebase(ref);
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