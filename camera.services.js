/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API.
 */

'use strict';

angular.module('Camera.services', [])
    .factory("phonegapCamera", ['$document', '$rootScope', '$q',
        function($document, $rootScope, $q) {
            console.debug("phonegapCamera", $window, $document);

            /**
             * browser development fallback
             */

            function browserFallBack() {
                var elemIds = {
                    videoEl: '#video',
                    canvasEl: '#canvas',
                    captureBtn: '#capture'
                };

                var BrowserDev = {
                    imgData: null,
                    imgURL: null,
                    localStream: null,
                    videoEl: document.querySelector(elemIds.videoEl),
                    canvasEl: document.querySelector(elemIds.canvasEl),
                    captureBtn: document.querySelector(elemIds.captureBtn),
                    ctx: canvasEl.getContext('2d'),

                    capture: function() {

                        // check if we have stream    
                        if (localStream) {
                            // draw contents of stream to canvas
                            ctx.drawImage(video, 0, 0);
                        }
                    },

                    gotStream: function(stream) {

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
                    },

                    noStream: function(err) {
                        alert("Camera stream could not start!");
                        console.error("ERROR: ", err)
                    },

                    takePhoto: function() {
                        var self = this;

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

                                this.captureBtn.onclick = function() {
                                    self.capture();
                                };
                            } catch (e) {
                                console.error("WARNING: Attempt to use browser Media support failed. \nTrying again...", e);

                                // failed once, try again
                                navigator.getUserMedia({
                                    video: true
                                }, gotStream, noStream);

                                this.captureBtn.onclick = function() {
                                    self.capture();
                                };
                            }
                        } else {
                            console.error("Could not find getUserMedia API support.");
                        }
                    }
                };

                // init fallback
                BrowserDev.takePhoto();

                // give the window access to fallback
                window.BrowserDev = BrowserDev;
            }

            /**
             * wrapped Phonegap Camera API
             */

            return {
                getPicture: function(opts) {

                    // init q
                    var deferred = $q.defer();

                    // TODO: Investigate best way to detect browser
                    // Possibel solution, User Agent
                    var browser = true;

                    if (browser) {
                        // TODO: Investigate ways to refactor
                        // using angular directives & services

                        browserFallBack();
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
