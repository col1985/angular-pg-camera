/**
 * @author: Colúm Bennett <colum.bennett@feedhenry.com>,
 * @description: Angular directive for Phonegap Camera Native API
 */

'use strict';

angular.module('Camera.directive', [])
    .directive('pgCamera', ['phonegapCamera',
        function($scope, phonegapCamera) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: 'CameraCtrl',
                templateUrl: 'components/camera.html',
                link: function(scope, elem, attrs, ctrl) {
                    console.debug("pgCamera directive", scope, el, att, ctrl);


                },
            };
        }
    ]);
