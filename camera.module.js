/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API, further info see README.md.
 */

'use strict';

angular.module('Camera.services')
    .factory("phonegapCamera", ['$window', '$document', '$rootScope', '$q',
        function($window, $document, $rootScope, $q) {
            console.debug("phonegapCamera", env);

            /**
             * browser development
             */

            function browserDebug() {

                var elemIds = {
                    screen: '#video',
                    canvas: '#canvas',
                    captureBtn: '#capture'
                };


                var imgData,
                    imgURL,
                    localStream = null,
                    screen = document.querySelector(elemIds.screen)
                    canvas = document.querySelector(elemIds.canvas)
                    captureBtn = document.querySelector(elemIds.captureBtn)
                    ctx = canvas.getContext('2d');


                // $window.bind('DOMContentLoaded', function() {    

                var capture = function() {

                    // check if we have stream    
                    if (localStream) {
                        // draw contents of stream to canvas
                        ctx.drawImage(video, 0, 0);
                        imgData =
                    }
                }

                var gotStream = function(stream) {

                    // IMPORTANT: video el will need autoplay attr or 
                    // stream will be frozen
                    if (window.URL) {
                        video.src = window.URL.createObjectURL(stream);
                    } else {
                        // opera support
                        video.src = stream;
                    }

                    // store the stream
                    localStream = stream;
                }

                var noStream = function(err) {
                    alert("Camera stream could not start!");
                    console.error("ERROR: ", err)
                }

                var photo = function() {
                    //Test browser support 
                    navigator.getUserMedia = navigator.getUserMedia ||
                        navigator.webkitGetUserMedia ||
                        navigator.mozGetUserMedia ||
                        navigator.msGetUserMedia;

                    // & URL obj    
                    window.URL = window.URL || window.webkitURL;

                    if (navigator.getUserMedia) {
                        try {
                            // grab stream
                            navigator.getUserMedia({
                                video: true
                            }, gotStream, noStream);
                        } catch (e) {
                            console.error("WARNING: Attempt to use browser Media support failed. \nTrying again...", e);

                            // failed once, try again
                            navigator.getUserMedia({
                                video: true
                            }, gotStream, noStream);
                        }
                    } else {
                        console.error("Could not find getUserMedia API support.");
                    }
                }
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
