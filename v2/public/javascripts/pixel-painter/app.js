(function (angular) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp', [
        'ngRoute',
        'ngCookies'
    ]);

    pixelPainterApp.config(
        [
            '$routeProvider',
            function($routeProvider) {
                $routeProvider.
                    when('/', {
                        templateUrl: '/javascripts/pixel-painter/load-route/partials/load-partial.html',
                        controller: 'loadController'
                    }).
                    when('/login', {
                        templateUrl: '/javascripts/pixel-painter/login-route/partials/login-partial.html',
                        controller: 'loginController'
                    }).
                    when('/logout', {
                        templateUrl: '/javascripts/pixel-painter/logout-route/partials/logout-partial.html',
                        controller: 'logoutController'
                    }).
                    when('/edit', {
                        templateUrl: '/javascripts/pixel-painter/edit-route/partials/edit-partial.html',
                        controller: 'editController'
                    }).
                    otherwise({
                        redirectTo: '/'
                    });

            }
        ]
    );

    pixelPainterApp.run([
            '$rootScope',
            '$location',
            '$http',
            '$cookies',
            function($rootScope, $location, $http, $cookies) {
                
                $rootScope.currentUser = false;

                // rootScope document object that is checked and loaded when on /edit route 
                $rootScope.loadDocument = false;

                $rootScope.go = function(location) {
                    $location.path(location);
                };

                $http.defaults.headers.post['X_CSRF_TOKEN'] = $cookies['XSRF-TOKEN'];

            }
    ]);

}(window.angular));