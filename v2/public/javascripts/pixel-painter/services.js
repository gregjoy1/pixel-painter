(function (angular) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.service('globalService', [
        function () {

            // global singleton boolean so that the entire application knows if the
            // mouse button is down.
            this.isMouseDown = false;

            // define zoom factors
            this.zoomFactors = [
                {
                    buttonTitle: 1,
                    zoomFactor: 0,
                    size: 48
                },
                {
                    buttonTitle: 2,
                    zoomFactor: 1,
                    size: 43
                },
                {
                    buttonTitle: 3,
                    zoomFactor: 2,
                    size: 38
                },
                {
                    buttonTitle: 4,
                    zoomFactor: 3,
                    size: 33
                },
                {
                    buttonTitle: 5,
                    zoomFactor: 4,
                    size: 28
                },
                {
                    buttonTitle: 6,
                    zoomFactor: 5,
                    size: 23
                },
                {
                    buttonTitle: 7,
                    zoomFactor: 6,
                    size: 18
                },
                {
                    buttonTitle: 8,
                    zoomFactor: 7,
                    size: 13
                }
            ];

        }
    ]);

    pixelPainterApp.service('documentSaveLoadService', [
        '$http',
        function ($http) {

            this.getAllDocuments = function (callback) {
                $http.get('/ajax/get_saved_documents').success(function (data) {
                    callback(data.error, data.data)
                }).error(function (data) {
                    callback(true, '404')
                });
            };

            this.saveNewDocument = function (name, json, callback) {

                // ensure json var is a string
                json = (typeof json !== 'string' ? JSON.stringify(json) : json);

                $http.post(
                    '/ajax/create_document',
                    {
                        name: name,
                        json: json
                    }
                ).success(function (data) {
                    callback(data.error, data.data)
                }).error(function (data) {
                    callback(true, '404')
                });
            };

            this.saveExistingDocument = function (documentId, name, json, callback) {

                // ensure json var is a string
                json = (typeof json !== 'string' ? JSON.stringify(json) : json);

                $http.post(
                    '/ajax/create_document',
                    {
                        document_id: documentId,
                        name: name,
                        json: json
                    }
                ).success(function (data) {
                    callback(data.error, data.data)
                }).error(function (data) {
                    callback(true, '404')
                });
            };

        }
    ]);

    pixelPainterApp.service('userService', [
        '$http', 
        '$rootScope',
        function ($http, $rootScope) {

            this.login = function (email, password, callback) {
                $http.post(
                    '/ajax/login',
                    {
                        email: email,
                        password: password
                    }
                ).success(function (data) {
                    if(!data.error) {
                        $rootScope.currentUser = data.data;
                    }
                    callback(data.error, data.data);
                }).error(function (data) {
                    callback(true, '404');
                });
            };

            this.logout = function (callback) {
                $http.get('/ajax/logout').success(function (data) {
                    $rootScope.currentUser = false;
                    callback(data.error, data.data);
                }).error(function (data) {
                    callback(true, '404');
                });
            };

           this.isLoggedIn = function (callback) {
                $http.get('/ajax/is_logged_in').success(function (data) {
                    $rootScope.currentUser = (data.error ? false : data.data);
                    callback(data.error, data.data);
                }).error(function (data) {
                    callback(true, '404');
                });
            };

        }
    ]);

    pixelPainterApp.service('helperService', [
        function () {

            this.HexStringToRGBArray = function (hex) {

                // strip # out of hex string
                hex = (
                    hex[0] == '#' ?
                        hex.substr(1, hex.length) :
                        hex
                );

                return [
                    parseInt(hex.substr(0, 2), 16),
                    parseInt(hex.substr(2, 2), 16),
                    parseInt(hex.substr(4, 2), 16)
                ];

            };

        }
    ]);

}(window.angular));