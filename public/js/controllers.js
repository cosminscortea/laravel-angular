app.controller("LoginController", function($scope, $location, AuthenticationService, SessionService) {
	if (SessionService.get('authenticated'))
		$location.path('/home');
	$scope.credentials = {
		email: "",
		password: "",
		remember: ""
	};

	$scope.login = function() {
		AuthenticationService.login($scope.credentials).success(function() {
			$location.path('/home');
		});
	};
});

app.controller("RegisterController", function($http, $scope, $location, FlashService) {
	$scope.register = function() {
		$http.post("auth/register", $scope.user).success(function(response) {
			$location.path('/');
			FlashService.show(response.flash, 'success');
		}).error(function(response) {
			FlashService.show(response.flash, 'error');
		});
	};
});

app.controller("ResetController", function($http, $scope, $location, FlashService) {
	$scope.requestReset = function() {
		$http.post("auth/reset", $scope.user).success(function(response) {
			$location.path('/');
			FlashService.show(response.flash, 'success');
		}).error(function(response) {
			FlashService.show(response.flash, 'warning');
		});
	};
});

app.controller("ResetPageController", function($http, $scope, $location, $routeParams, AuthenticationService, FlashService) {
	$scope.resetPassword = function() {
		var data = $scope.user;
		FlashService.clear;
		$http.post("auth/resetPassword/" + $routeParams.token, data).success(function(response) {
			$location.path('/');
			FlashService.show(response.flash, 'success');
		});
	};
});

app.controller("BooksController", function($scope, books) {
	$scope.books = books.data;
});

app.controller("ProfileController", function($scope, profile, $http, FlashService) {

	$scope.update = function() {
		$http.post('user/update/' + profile.data.id, $scope.profile).success(function(response) {
			FlashService.show(response.flash);
		}).error(function(response) {
			FlashService.show(response.flash);
		});
	}
	$scope.profile = profile.data;

});

app.controller("UserController", function($scope, $http, FlashService, $route, $filter, CrudService, $routeParams, SelectService) {

	$scope.create = function() {
		CrudService.create('user/create', $scope.user);
	}
	$scope.update = function() {
		CrudService.update('user/update/id=', $scope.user.id, $scope.user);
	}

	$scope.user = SelectService.get('user/show', $routeParams.id);
	console.log($scope.user.first_name);
	//console.log(SelectService.get('user/show', $routeParams.id));

	// $http.post('user/create', $scope.user).success(function(response) {
	// 	FlashService.show(response.flash);
	// 	$route.reload();
	// }).error(function(response) {
	// 	FlashService.show(response.flash);
	// });
	//}

	// $scope.remove = function(id) {
	// 	$http.post('user/destroy/' + id).success(function(response) {
	// 		FlashService.show(response.flash);
	// 		$route.reload();
	// 	}).error(function(response) {
	// 		FlashService.show(response.flash);
	// 	});
	// }

	// $scope.update = function(id) {
	// 	$http.post('user/update/' + id, $scope.user).success(function(response) {
	// 		FlashService.show(response.flash);
	// 		$route.reload();
	// 	}).error(function(response) {
	// 		FlashService.show(response.flash);
	// 	});
	// }

	// $scope.users = user.data;

	// $scope.filterFunction = function(element) {
	// 	return element.first_name.match() ? true : false;
	// };

	// $scope.itemsPerPage = 3;
	// $scope.currentPage = 0;

	// $scope.range = function() {
	// 	var rangeSize = 2;
	// 	var ret = [];
	// 	var start;

	// 	start = $scope.currentPage;
	// 	if (start > $scope.pageCount() - rangeSize) {
	// 		start = $scope.pageCount() - rangeSize + 1;
	// 	}

	// 	for (var i = start; i < start + rangeSize; i++) {
	// 		ret.push(i);
	// 	}
	// 	return ret;
	// };

	// $scope.prevPage = function() {
	// 	if ($scope.currentPage > 0) {
	// 		$scope.currentPage--;
	// 	}
	// };

	// $scope.prevPageDisabled = function() {
	// 	return $scope.currentPage === 0 ? "disabled" : "";
	// };

	// $scope.pageCount = function() {
	// 	return Math.ceil($scope.users.length / $scope.itemsPerPage) - 1;
	// };

	// $scope.nextPage = function() {
	// 	if ($scope.currentPage < $scope.pageCount()) {
	// 		$scope.currentPage++;
	// 	}
	// };

	// $scope.nextPageDisabled = function() {
	// 	return $scope.currentPage === $scope.pageCount() ? "disabled" : "";
	// };

	// $scope.setPage = function(n) {
	// 	$scope.currentPage = n;
	// };

});

app.controller('AddeditController', function($scope, $rootScope, $location, $routeParams, CrudService, customer) {
	var customerID = ($routeParams.customerID) ? parseInt($routeParams.customerID) : 0;
	$rootScope.title = (customerID > 0) ? 'Edit Customer' : 'Add Customer';
	$scope.buttonText = (customerID > 0) ? 'Update Customer' : 'Add New Customer';
	var original = customer.data;
	original._id = customerID;
	$scope.customer = angular.copy(original);
	$scope.customer._id = customerID;

	$scope.isClean = function() {
		return angular.equals(original, $scope.customer);
	}

	$scope.deleteCustomer = function(customer) {
		$location.path('/');
		if (confirm("Are you sure to delete customer number: " + $scope.customer._id) == true)
			CrudService.deleteCustomer(customer.customerNumber);
	};

	$scope.saveCustomer = function(customer) {
		$location.path('/');
		if (customerID <= 0) {
			CrudService.insertCustomer(customer);
		} else {
			CrudService.updateCustomer(customerID, customer);
		}
	};
});


app.controller("HomeController", function($http, $scope, $location, AuthenticationService, SessionService) {
	$scope.title = "Awesome Home";
	$scope.message = "Mouse Over these images to see a directive at work!";

	$scope.logout = function() {
		AuthenticationService.logout().success(function() {
			$location.path('/');
		});
	};
});

app.controller('ConfirmController', function($http, $routeParams, $location, FlashService) {
	var data = $routeParams;
	$http.post("auth/confirm", data).success(function(response) {
		$location.path('/');
		FlashService.show(response.flash);
	});


});