/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: Angular Controller for Phonegap Camera Native API
 */

'use strict'

angular.module('Camera.controller', [])
    .controller('CameraCtrl', ['$scope', 'phonegapCamera',
        function($scope, phonegapCamera) {
            console.debug($scope, phonegapCamera)
            $scope.takePhoto = function() {
                console.debug()
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
