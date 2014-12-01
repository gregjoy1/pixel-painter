(function (angular) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.directive('syncHeight', [
        '$window',
        function ($window) {

            // ensures that toolbar + canvas viewport take up 100% of the height of the screen,
            // no more, no less.
            return {
                controller: function ($scope, $element) {
                    // could have used calc() in css to control the height but made a directive
                    // to ensure compatibility

                    var window = angular.element($window);

                    var applyResize = function () {

                        // Work out toolbar height
                        var header = document.getElementById('pixel-painter-toolbar');
                        var headerHeight = parseInt($window.getComputedStyle(header, null).getPropertyValue('height'));

                        // defaults to 41 (which it should always be) if it cannot be found or
                        // if browser doesn't support getComputedStyle
                        headerHeight = (headerHeight !== undefined ? headerHeight : 41);

                        $element.css({
                            'height': ($window.innerHeight - headerHeight) + 'px'
                        });

                    };

                    // when browser is resized, call applyResize function
                    window.on('resize', applyResize);

                    applyResize();
                }
            };

        }
    ]);

}(window.angular));