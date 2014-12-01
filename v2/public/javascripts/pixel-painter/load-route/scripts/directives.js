(function (angular) {
    'use strict';

	var pixelPainterApp = angular.module('PixelPainterApp');

	pixelPainterApp.directive('renderDocumentPreview', [
		'renderDocumentService',
		function (renderDocumentService) {
           return {
           		scope: {
           			'documentData': '='
           		},
                link: function ($scope, $element) {
                	var img = new Image();
                	img.src = renderDocumentService.renderDocumentPreviewPNG($scope.documentData, 7);

                	$element.append(img);
                }
            };
		}
	]);

}(window.angular));