(function (angular) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.controller('logoutController', [
    	'$scope',
    	'userService',
    	function ($scope, userService) {
    		$scope.logoutError = false;
    		$scope.logoutSuccess = false;

    		userService.logout(function (error, data) {
    			if(error) {
    				$scope.logoutError = data;
    			} else {
		    		$scope.logoutSuccess = true;
    			}
    		});
    	}
	]);

}(window.angular));