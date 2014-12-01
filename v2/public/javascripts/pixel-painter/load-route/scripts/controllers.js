(function (angular) {
    'use strict';

	var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.controller('loadController', [
    	'$scope',
    	'$rootScope',
    	'documentSaveLoadService',
    	'userService',
    	function ($scope, $rootScope, documentSaveLoadService, userService) {
			$scope.loadError = false;

            // redirect if user not logged in
    		userService.isLoggedIn(function (error, data) {
    			if(error) {
    				$scope.loadError = data;
    			}
    		});

    		$scope.savedDocuments = false;

    		// auto load and list saved documents
    		documentSaveLoadService.getAllDocuments(function (error, data) {
				if(error) {
					$scope.loadError = data;
				} else {
					$scope.loadError = false;			
		    		$scope.savedDocuments = data;
				}
    		});

            $scope.loadDocument = function (documentObject) {
                $rootScope.loadDocument = documentObject;
                $scope.go('/edit');
            };

    	}
	]);

}(window.angular));