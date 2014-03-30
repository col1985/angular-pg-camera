/**
 *  Module
 *
 * Description
 */

'use strict'

angular.module('Camera')
    .controller('CameraCtrl', ['$scope', 'phonegapCamera',
        function($scope, phonegapCamera) {

            $scope.takePhoto = function() {
                phonegapCamera.getPicture()
                    .then(function(imageData) {
                        $scope.picSrc = "data:image/jpeg;base64," + imageData;
                    }).
                catch (function(err) {
                    console.error("ERROR: Take Photo fn has failed!\n", err);
                });
            };
        }
    ]);
