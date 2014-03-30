/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API, further info see README.md.
 */

'use strict';

var cam = angular.module('Camera', []);

cam.factory("phonegapCamera", ['$window', '$document', '$rootScope', '$q',
    function($window, $document, $rootScope, $q) {
        console.debug("phonegapCamera", env);


        /**
         * check for existence of getUserMedia API
         */

        function hasGetUserMedia() {
            return !!(navigator.getUserMedia || navigator.webkitGetUserMedia ||
                navigator.mozGetUserMedia || navigator.msGetUserMedia);
        }

        return {
            getPicture: function(opts) {

                // init q
                var deferred = $q.defer();

                /**
                 * check for browser, implement fallback for
                 * debugging in browser.
                 */
                if (hasGetUserMedia() && browser) {

                    navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

                    // TODO: Investigate using getUserMedia API
                    // for desktop development


                } else {

                    var defaultOpts = {
                        quality: 75,
                        destinationType: Camera.DestinationType.DATA_URL,
                        allowEdit: true,
                        targetWidth: 75,
                        targetHeight: 75
                    };

                    /**
                     * replace defaultOpts with user defined opts
                     */
                    if (opts) {
                        opts = angular.extend(defaultOpts, opts);
                    }

                    /**
                     * handle Image capture success
                     */
                    var success = function(imageData) {
                        console.debug(imageData);
                        $rootScope.$apply(function() {
                            deferred.resolve(imageData);
                        });
                    };

                    /**
                     * handle Image capture fail
                     */
                    var failed = function(message) {
                        console.debug(message);
                        $rootScope.$apply(function() {
                            deferred.reject(message);
                        })
                    };

                    /**
                     * Call camera via Cordova on deviceready
                     */
                    $document.bind('deviceready', function() {
                        navigator.camera.getPicture(success, failed, opts);
                    })

                    /**
                     * return promise
                     */
                    return deferred.promise;
                }

            }
        };
    }
]);

cam.directive('pgCamera', ['$scope',
    function($scope) {
        return {
            restrict: 'E',
            replace: true,
            transclude: true,
            controller: 'CameraCtrl'
            link: function($scope, elem, attrs, ctrl) {
                console.debug("pgCamera directive");


            },
            templateUrl: 'components/camera.html',
        };
    }
]);
