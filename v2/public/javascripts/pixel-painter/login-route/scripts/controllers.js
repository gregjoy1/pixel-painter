(function (angular) {
    'use strict';

	var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.controller('loginController', [
    	'$scope',
    	'userService',
    	function ($scope, userService) {

    		$scope.loginFormParams = {
    			email: '',
    			password: ''
    		};

    		$scope.loginError = false;

            // redirect if user already logged in
    		userService.isLoggedIn(function (error, data) {
    			if(!error) {
    				$scope.go('/');
    			}
    		});

    		$scope.submitLoginForm = function () {
                console.log($scope.loginFormParams);
                if($scope.loginFormParams.email !== '' && $scope.loginFormParams.password !== '') {
                    userService.login($scope.loginFormParams.email, $scope.loginFormParams.password, function (error, data) {
                        console.log(error, data);
    					if(error) {
							$scope.loginError = data;
    					} else {
							$scope.loginError = '';
    						$scope.go('/');
    					}
    				});
    			} else {
					$scope.loginError = 'Please check your email/password';
    			}
    		};
    	}
	]);

}(window.angular));