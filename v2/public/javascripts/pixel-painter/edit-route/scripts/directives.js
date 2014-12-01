(function (angular, jscolor) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.directive('pixelPainterCanvas', [
        'globalService',
        function (globalService) {
            return {
                controller: function ($scope, $element) {
                    // pixelMap 2d array width, height
                    $scope.width = 0;
                    $scope.height = 0;

                    $scope.canvasStyle = {};

                    // pixelMap 2d array containing all
                    $scope.pixelMap = [];

                    $scope.createBlankPixelMap = function (width, height) {

                        $scope.width = width;
                        $scope.height = height;

                        // create 2d array of pixel objects in accordance to width, height specified
                        var yInc;
                        var xInc;
                        var row;

                        for (yInc = 0; yInc < height; yInc++) {

                            row = [];

                            for (xInc = 0; xInc < width; xInc++) {
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

                    $scope.loadPixelMap = function (documentData) {

                        var height = documentData.data.height;
                        var width = documentData.data.width;

                        $scope.width = width;
                        $scope.height = height;

                        // create 2d array of pixel objects in accordance to width, height specified
                        var yInc;
                        var xInc;
                        var row;

                        for (yInc = 0; yInc < height; yInc++) {

                            row = [];

                            for (xInc = 0; xInc < width; xInc++) {
                                row.push({
                                    // default colour
                                    colour: documentData.data.data[yInc][xInc],
                                    // x, y coords so that pixel knows its own location in pixelMap array
                                    x: xInc,
                                    y: yInc
                                });
                            }

                            $scope.pixelMap.push(row);

                        }

                        console.log(documentData);

                        // zoom canvas in to current zoom factor
                        zoomCanvasToFactor($scope.zoomFactor);

                    };

                    var zoomCanvasToFactor = function (factor) {

                        // if invalid factor is entered, use default
                        var selectedZoomFactor = (
                            globalService.zoomFactors[factor] === undefined ?
                                globalService.zoomFactors[0] :
                                globalService.zoomFactors[factor]
                        );

                        // work out width and height of table to ensure scrolling works as desired
                        $element.css({
                            width: ($scope.width * selectedZoomFactor.size) + 'px',
                            height: ($scope.height * selectedZoomFactor.size) + 'px'
                        });

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
                    $scope.restrictEventCallsToOne = function (pixelX, pixelY, colour, toolId) {

                        var hasEventAlreadyBeenCalled = (
                            lastEventCallData.pixelX == pixelX &&
                            lastEventCallData.pixelY == pixelY &&
                            lastEventCallData.colour == colour &&
                            lastEventCallData.toolId == toolId
                        );

                        // if the event call has already been made, then ignore it, if not execute it
                        if(!hasEventAlreadyBeenCalled) {

                            // cludge to hide colour picker when canvas is clicked
                            $scope.hideColourPicker();

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
                    $scope.useToolOnPixel = function (pixelX, pixelY, colour, toolId) {
                        // if currently selected tool does not exist (for some reason?!)
                        // use default tool
                        if($scope.tools[toolId] !== undefined) {
                            $scope.tools[toolId].useTool(pixelX, pixelY, colour);
                        } else {
                            $scope.tools.brush.useTool(pixelX, pixelY, colour);
                        }
                    };


                    // define tools
                    $scope.tools = {
                        brush: {
                            id: 'brush',
                            useTool: function (pixelX, pixelY, colour) {
                                // cludge? :(
                                $scope.$apply(function () {
                                    $scope.pixelMap[pixelY][pixelX].colour = colour;
                                });
                            }
                        },
                        fill: {
                            id: 'fill',
                            useTool: function (pixelX, pixelY, desiredColour) {
                                // find colour to replace with desired colour
                                var replaceColour = $scope.pixelMap[pixelY][pixelX].colour;

                                // another cludge? :(
                                $scope.$apply(function () {
                                    $scope.tools.fill.fill(
                                        pixelX,
                                        pixelY,
                                        replaceColour,
                                        desiredColour
                                    );
                                });
                            },
                            fill: function (pixelX, pixelY, replaceColour, desiredColour)
                            {

                                // recursively fill pixel map

                                // cant compare array, so make it string so it can be compared
                                if($scope.pixelMap[pixelY][pixelX].colour.toString() != replaceColour.toString()) {
                                    return false;
                                } else {
                          
                                    $scope.pixelMap[pixelY][pixelX].colour = desiredColour;

                                    // check left
                                    if((pixelX - 1) >= 0) {
                                        this.fill((pixelX - 1), pixelY, replaceColour, desiredColour);
                                    }

                                    // check right
                                    if((pixelX + 1) < $scope.width) {
                                        this.fill((pixelX + 1), pixelY, replaceColour, desiredColour);
                                    }

                                    // check top
                                    if((pixelY - 1) >= 0) {
                                        this.fill(pixelX, (pixelY - 1), replaceColour, desiredColour);
                                    }

                                    // check bottom
                                    if((pixelY + 1) < $scope.height) {
                                        this.fill(pixelX, (pixelY + 1), replaceColour ,desiredColour);
                                    }

                                    return true;
                                }

                            }
                        }
                    };

                    if($scope.loadDocument) {
                        $scope.loadPixelMap($scope.loadDocument);
                    } else {
                        $scope.createBlankPixelMap(50, 25);
                    }

                    // call zoomCanvasToFactor when $scope.zoomFactor is changed
                    $scope.$watch('zoomFactor', function () {
                        zoomCanvasToFactor($scope.zoomFactor);
                    });
                }
            };
        }
    ]);

    pixelPainterApp.directive('pixelPainterPixel', [
        'globalService',
        function (globalService) {
            return {
                controller: function ($scope, $element) {

                    var pixel = $element[0];

                    // turn rgb array into rgb css string
                    $scope.getRGBColourString = function () {
                        return 'rgb(' +
                            $scope.pixel.colour[0] + ',' +
                            $scope.pixel.colour[1] + ',' +
                            $scope.pixel.colour[2] + ')';
                    };

                    // if pixel colour changes, alter the css to reflect colour change
                    $scope.$watch('pixel.colour', function () {
                        $element.css('background-color', $scope.getRGBColourString());
                    });

                    // add event listeners
                    pixel.onmouseup = function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        // set isMouseDown to false in globalService singleton
                        globalService.isMouseDown = false;

                    };

                    pixel.onmousemove = function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        // if mouse click is down when moved, apply tool to pixel
                        if(globalService.isMouseDown) {
                            $scope.restrictEventCallsToOne(
                                $scope.pixel.x,
                                $scope.pixel.y,
                                $scope.currentColour,
                                $scope.currentToolId
                            );
                        }
                    };

                    pixel.onmousedown = function (event) {
                        event.preventDefault();
                        event.stopImmediatePropagation();

                        // set isMouseDown to true in globalService singleton
                        globalService.isMouseDown = true;

                        $scope.restrictEventCallsToOne(
                            $scope.pixel.x,
                            $scope.pixel.y,
                            $scope.currentColour,
                            $scope.currentToolId
                        );
                    };

                }
            };
        }
    ]);

    pixelPainterApp.directive('pixelPainterToolbar', [
        'globalService',
        'helperService',
        'documentSaveLoadService',
        function (globalService, helperService, documentSaveLoadService) {
            return {
                templateUrl: '/javascripts/pixel-painter/edit-route/partials/edit-toolbar-partial.html',
                controller: function ($scope) {

                    // init jscolor
                    jscolor.init();

                    $scope.zoomFactorButtons = globalService.zoomFactors;

                    $scope.colourPickerValue = '';

                    $scope.$watch('colourPickerValue', function () {
                        $scope.currentColour = helperService.HexStringToRGBArray($scope.colourPickerValue);
                    });

                    $scope.zoomFactorContainerClass = {
                        'show' : false
                    };

                    $scope.saveImage = function () {
                        console.log($scope.loadDocument);
                        if($scope.loadDocument) {
                            // documentSaveLoadService.saveExistingDocument($scope.loadDocument.id, $scope.loadDocument.name, $scope.pixelMap, callback) 
                        } else {
                            var imageName = prompt('Please enter the title of the image.');
                            documentSaveLoadService.saveNewDocument(imageName, $scope.pixelMap, function (error, data) {
                                if(error) {
                                    alert(data);
                                } else {
                                    $scope.go('/');
                                }
                            });
                        }
                    };

                    $scope.toggleShowZoomFactor = function () {
                        $scope.hideColourPicker();
                        $scope.zoomFactorContainerClass.show = !$scope.zoomFactorContainerClass.show;
                    };

                    $scope.changeZoomFactor = function (zoomFactor) {
                        $scope.hideColourPicker();
                        $scope.zoomFactor = zoomFactor;
                        $scope.zoomFactorContainerClass.show = false;
                    };

                    // abit of a cludge to ensure colour picker is shown
                    $scope.showColourPicker = function () {
                        document.getElementById('toolbarColourSelect').color.showPicker();
                    };

                    // cludge to ensure colour picker is hidden
                    $scope.hideColourPicker = function () {
                        var colorPickerInput = document.getElementById('toolbarColourSelect');
                        colorPickerInput.blur();
                        colorPickerInput.color.hidePicker();
                    };

                    $scope.changeTool = function (zoomTool) {
                        $scope.hideColourPicker();
                        $scope.currentToolId = zoomTool;
                    };

                    $scope.toggleShowGrid = function () {
                        $scope.showGrid = !$scope.showGrid;
                        $scope.showGridButtonText = ($scope.showGrid ? 'Hide Grid' : 'Show Grid');
                    };

                    $scope.showGridButtonText = 'Hide Grid';

                }
            };
        }
    ]);

}(window.angular, window.jscolor));