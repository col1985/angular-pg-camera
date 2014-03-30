'use strict';

angular.module('Camera.directives')
    .directive('pgCamera', ['$scope', 'phonegapCamera',
        function($scope, phonegapCamera) {
            return {
                restrict: 'E',
                replace: true,
                transclude: true,
                controller: 'CameraCtrl',
                link: function(scope, elem, attrs, ctrl) {
                    console.debug("pgCamera directive", $scope, elem, attrs, ctrl);
                },
                templateUrl: 'components/camera.html',
            };
        }
    ]);
