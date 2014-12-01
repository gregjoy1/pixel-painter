(function (angular, _) {
    'use strict';

    var pixelPainterApp = angular.module('PixelPainterApp');

    pixelPainterApp.service('renderDocumentService', [
        function () {
        	this.renderDocumentToCanvas = function (documentData, tileSize) {
        		
        		var canvas = document.createElement('canvas');

        		canvas.width = (documentData.width * tileSize);
        		canvas.height = (documentData.height * tileSize);

        		var canvasContext = canvas.getContext('2d');

        		_(documentData.data).each(function (documentDataRow, yPos) {
        			_(documentDataRow).each(function (tile, xPos) {
        				canvasContext.fillStyle = 'rgb(' + tile[0] + ',' + tile[1] + ',' + tile[2] + ')'
        				canvasContext.fillRect((xPos * tileSize), (yPos * tileSize), tileSize, tileSize);
        			});
        		});

        		return canvas;

        	};

        	this.extractPNGFromCanvas = function (canvas) {
        		return canvas.toDataURL();
        	};

        	this.renderDocumentPreviewPNG = function (documentData, tileSize) {
				var canvas = this.renderDocumentToCanvas(documentData, tileSize);
				return this.extractPNGFromCanvas(canvas);
        	};
        }
    ]);

    

}(window.angular, window._));