/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: angularJS service module wrapping Phonegaps Native Camera API, further info see README.md.
 */

'use strict'

angular.module('camera.services')
    .factory("phonegapCamera", ['$rootScope', '$q', 'env',
        function($rootScope, $q, env) {
            console.debug("phonegapCamera", env);

            return {
                getPicture: function(opts) {

                    // init q
                    var deferred = $q.defer();



                    /**
                     * check for browser, implement fallback for
                     * debugging in browser.
                     */
                    if (env.browser) {

                        /**
                         * create element, but dont append to dom
                         */

                        var fileEl = document.createElement('input');
                        fileEl = setAttribute('type', 'file');

                        fileEl.onchnage = function() {
                            var file = fileEl.files[0];
                            var reader = new FileReader();
                            reader.readAsDataURL(file);
                            reader.onLoadEnd = function() {
                                $rootScope.$apply(function() {
                                    // strip beginning from string
                                    var encodedData = reader.result.replace(/data:image\/jpeg;base64,/, '');
                                    deferred.resolve(encodedData);
                                });
                            }
                        };

                        fileEl.click();
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
                         * Call camera via Cordova
                         */
                        navigator.camera.getPicture(success, failed, opts);

                        /**
                         * return promise
                         */
                        return deferred.promise;
                    }

                }
            };
        }
    ]);
