/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API, further info see README.md.
 */

'use strict'

angular.module('Camera', [])

.constant('cameraConfig', {})

.controller('CameraCtrl', ['',
    function() {

    }
])

.directive('browserFallback', function() {
    // Runs during compile
    return {
        link: function(scope, iElm, iAttrs, controller) {

        }
    };
})

.directive('pgCamera', function() {
    // Runs during compile
    return {
        link: function(scope, iElm, iAttrs, controller) {

        }
    };
});
