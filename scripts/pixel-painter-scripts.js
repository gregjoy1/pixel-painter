var pixelPainterApp = angular.module('PixelPainterApp', []);

pixelPainterApp.controller('AppController', function($scope) {

    // defines currently used tool (default brush)
    $scope.currentToolId = 'brush';

    // defines currently used color (default black)
    $scope.currentColour = [0, 0, 0];

    // defines currently used zoom factor (default 40x40)
    $scope.zoomFactor = 0

});

pixelPainterApp.directive('handleCanvas', function() {
    return {
        controller: function($scope, $element) {

            // pixelMap 2d array width, height
            $scope.width = 0;
            $scope.height = 0;

            $scope.canvasStyle = {};

            // set default of 40px x 40px pixel size
            $scope.canvasClass = 'zoom-factor-zero';

            // pixelMap 2d array containing all
            $scope.pixelMap = [];

            $scope.createBlankPixelMap = function(width, height) {

                $scope.width = width;
                $scope.height = height;

                // create 2d array of pixel objects in accordance to width, height specified
                for(var yInc = 0; yInc < height; yInc++) {

                    var row = [];

                    for(var xInc = 0; xInc < width; xInc++) {
                        row.push({
                            // default colour
                            colour: [255, 255, 255],
                            // x, y coords so that pixel knows its own location in pixelMap array
                            x: xInc,
                            y: yInc
                        });
                    }

                    $scope.pixelMap.push(row);

                }

                // zoom canvas in to current zoom factor
                zoomCanvasToFactor($scope.zoomFactor);

            };

            var zoomCanvasToFactor = function(factor) {

                // define zoom factors
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

                // if invalid factor is entered, use default
                var selectedZoomFactor = (
                    zoomFactors[factor] == undefined ?
                        zoomFactors[0] :
                        zoomFactors[factor]
                );

                // work out width and height of table to ensure scrolling works as desired
                $element.css({
                    width: ($scope.width * selectedZoomFactor.size) + 'px',
                    height: ($scope.height * selectedZoomFactor.size) + 'px'
                });

                // change canvas class name to zoomFactor so that pixels resize
                $scope.canvasClass = selectedZoomFactor.className;

            };

            // log of last event call data
            var lastEventCallData = {
                pixelX: undefined,
                pixelY: undefined,
                colour: undefined,
                toolId: undefined
            };

            // restrict event calls to one, to avoid spamming the canvas with unnecessary repeat
            // pixel colour change calls
            $scope.restrictEventCallsToOne = function(pixelX, pixelY, colour, toolId) {

                var hasEventAlreadyBeenCalled = (
                    lastEventCallData.pixelX == pixelX &&
                    lastEventCallData.pixelY == pixelY &&
                    lastEventCallData.colour == colour &&
                    lastEventCallData.toolId == toolId
                );

                // if the event call has already been made, then ignore it, if not execute it
                if(!hasEventAlreadyBeenCalled) {

                    // use tool at desired location
                    $scope.useToolOnPixel(pixelX, pixelY, colour, toolId);

                    // log event call
                    lastEventCallData.pixelX = pixelX;
                    lastEventCallData.pixelY = pixelY;
                    lastEventCallData.colour = colour;
                    lastEventCallData.toolId = toolId;
                }
            };

            // use currently selected tool at specified location with currently
            // selected colour
            $scope.useToolOnPixel = function(pixelX, pixelY, colour, toolId) {
                // if currently selected tool does not exist (for some reason?!)
                // use default tool
                if($scope.tools[toolId] != undefined) {
                    $scope.tools[toolId].useTool(pixelX, pixelY, colour);
                } else {
                    $scope.tools['brush'].useTool(pixelX, pixelY, colour);
                }
            };


            // define tools
            $scope.tools = {
                brush: {
                    id: 'Paint Brush',
                    useTool: function(pixelX, pixelY, colour) {
                        // cludge? :(
                        $scope.$apply(function() {
                            $scope.pixelMap[pixelY][pixelX].colour = colour;
                        });
                    }
                }
            };

            // create blank pixel map - TODO call this from new canvas dialog
            $scope.createBlankPixelMap(50, 25);

            // call zoomCanvasToFactor when $scope.zoomFactor is changed
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

            // turn rgb array into rgb css string
            $scope.getRGBColourString = function() {
                return 'rgb(' +
                    $scope.pixel.colour[0] + ',' +
                    $scope.pixel.colour[1] + ',' +
                    $scope.pixel.colour[2] + ')';
            };

            // if pixel colour changes, alter the css to reflect colour change
            $scope.$watch('pixel.colour', function() {
                $element.css('background-color', $scope.getRGBColourString());
            });

            // add event listeners
            pixel.onmouseup = function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                // set isMouseDown to false in eventService singleton
                eventService.isMouseDown = false;

            };

            pixel.onmousemove = function(event) {
                event.preventDefault();
                event.stopImmediatePropagation();

                // if mouse click is down when moved, apply tool to pixel
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

                // set isMouseDown to true in eventService singleton
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

    // ensures that toolbar + canvas viewport take up 100% of the height of the screen,
    // no more, no less.
    return {
        controller: function($scope, $element) {

            // could have used calc() in css to control the height but made a directive
            // to ensure compatibility

            var window = angular.element($window);

            var applyResize = function() {

                // Work out toolbar height
                var header = document.getElementById('pixel-painter-toolbar');
                var headerHeight = parseInt($window.getComputedStyle(header, null).getPropertyValue('height'));

                // defaults to 41 (which it should always be) if it cannot be found or
                // if browser doesn't support getComputedStyle
                headerHeight = (headerHeight != undefined ? headerHeight : 41);

                $element.css({
                    'height': ($window.innerHeight - headerHeight) + 'px'
                });

            };

            // when browser is resized, call applyResize function
            window.on('resize', applyResize);

            applyResize();
        }
    };

});

pixelPainterApp.service('eventService', function() {

    // global singleton boolean so that the entire application knows if the
    // mouse button is down.
    this.isMouseDown = false;

});