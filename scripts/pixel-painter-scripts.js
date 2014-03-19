var pixelPainterApp = angular.module('PixelPainterApp', []);

pixelPainterApp.controller('AppController', function($scope) {

    $scope.currentToolId = 'brush';
    $scope.currentColour = [0, 0, 0];

    $scope.zoomFactor = 0

});

pixelPainterApp.directive('handleCanvas', function() {
    return {
        controller: function($scope, $element) {

            $scope.width = 0;
            $scope.height = 0;

            $scope.canvasStyle = {};

            // set default of 40px x 40px pixel size
            $scope.canvasClass = 'zoom-factor-three';

            $scope.pixelMap = [];

            $scope.createBlankPixelMap = function(width, height) {

                $scope.width = width;
                $scope.height = height;

                for(var yInc = 0; yInc < height; yInc++) {

                    var row = [];

                    for(var xInc = 0; xInc < width; xInc++) {
                        row.push({
                            colour: [255, 255, 255],
                            empty: true,
                            x: xInc,
                            y: yInc
                        });
                    }

                    $scope.pixelMap.push(row);

                }

                zoomCanvasToFactor($scope.zoomFactor);

            };

            var zoomCanvasToFactor = function(factor) {

                var zoomFactors = [
                    {
                        className: 'zoom-factor-zero',
                        size: 40
                    },
                    {
                        className: 'zoom-factor-one',
                        size: 20
                    },
                    {
                        className: 'zoom-factor-two',
                        size: 10
                    },
                    {
                        className: 'zoom-factor-three',
                        size: 5
                    }
                ];

                var selectedZoomFactor = (
                    zoomFactors[factor] == undefined ?
                        zoomFactors[0] :
                        zoomFactors[factor]
                );

                $element.css({
                    width: ($scope.width * selectedZoomFactor.size) + 'px',
                    height: ($scope.height * selectedZoomFactor.size) + 'px'
                });

                $scope.canvasClass = selectedZoomFactor.className;

            };

            var lastEventCallData = {
                pixelX: undefined,
                pixelY: undefined,
                colour: undefined,
                toolId: undefined
            };

            $scope.restrictEventCallsToOne = function(pixelX, pixelY, colour, toolId) {

                var hasEventAlreadyBeenCalled = (
                    lastEventCallData.pixelX == pixelX &&
                    lastEventCallData.pixelY == pixelY &&
                    lastEventCallData.colour == colour &&
                    lastEventCallData.toolId == toolId
                );

                if(!hasEventAlreadyBeenCalled) {

                    $scope.useToolOnPixel(pixelX, pixelY, colour, toolId);

                    lastEventCallData.pixelX = pixelX;
                    lastEventCallData.pixelY = pixelY;
                    lastEventCallData.colour = colour;
                    lastEventCallData.toolId = toolId;
                }
            };

            $scope.useToolOnPixel = function(pixelX, pixelY, colour, toolId) {
                if($scope.tools[toolId] != undefined) {
                    $scope.tools[toolId].useTool(pixelX, pixelY, colour);
                } else {
                    $scope.tools['brush'].useTool(pixelX, pixelY, colour);
                }
            };


            $scope.tools = {
                brush: {
                    id: 'Paint Brush',
                    useTool: function(pixelX, pixelY, colour) {
                        $scope.$apply(function() {
                            $scope.pixelMap[pixelY][pixelX].colour = colour;
                        });
                    }
                }
            };

            $scope.createBlankPixelMap(50, 25);

            $scope.$watch('zoomFactor', function() {
                zoomCanvasToFactor($scope.zoomFactor);
            });
        }
    };
});

pixelPainterApp.directive('handlePixel', function(eventService) {
    return {
        controller: function($scope, $element) {

            var pixel = $element[0];

            $scope.getRGBColourString = function() {
                return 'rgb(' +
                    $scope.pixel.colour[0] + ',' +
                    $scope.pixel.colour[0] + ',' +
                    $scope.pixel.colour[0] + ')';
            };

            $scope.$watch('pixel.colour', function() {
                $element.css('background-color', $scope.getRGBColourString());
            });

            pixel.onmouseup = function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                eventService.isMouseDown = false;

            };

            pixel.onmousemove = function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                if(eventService.isMouseDown) {
                    $scope.restrictEventCallsToOne(
                        $scope.pixel.x,
                        $scope.pixel.y,
                        $scope.currentColour,
                        $scope.currentToolId
                    );
                }
            };

            pixel.onmousedown = function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                eventService.isMouseDown = true;

                $scope.restrictEventCallsToOne(
                    $scope.pixel.x,
                    $scope.pixel.y,
                    $scope.currentColour,
                    $scope.currentToolId
                );
            };

        }
    }
});

pixelPainterApp.directive('syncHeight', function($window) {

    return {
        controller: function($scope, $element) {
            var window = angular.element($window);

            var applyResize = function() {

                // Work out header height
                var header = document.getElementById('pixel-painter-toolbar');
                var headerHeight = parseInt($window.getComputedStyle(header, null).getPropertyValue('height'));

                headerHeight = (headerHeight != undefined ? headerHeight : 41);

                $element.css({
                    'height': ($window.innerHeight - headerHeight) + 'px'
                });

            };

            window.on('resize', applyResize);

            $window.scrollTop = 0;
            applyResize();
        }
    };

});

pixelPainterApp.service('eventService', function() {

    this.isMouseDown = false;

});