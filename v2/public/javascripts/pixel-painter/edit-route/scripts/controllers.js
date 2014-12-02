(function (angular) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.controller('editController', [
        '$scope',
        '$rootScope',
        function ($scope, $rootScope) {

            // defines currently used tool (default brush)
            $scope.currentToolId = 'brush';

            // defines currently used color (default black)
            $scope.currentColour = [0, 0, 0];

            // defines currently used zoom factor (default 40x40)
            $scope.zoomFactor = 0;

            $scope.showGrid = true;
        }
    ]);

}(window.angular));