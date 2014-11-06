angular.module('myapp.directives', [])
    .directive('navbar', [function () {
        'use strict';
        return {
            restrict: 'A',
            templateUrl: 'scripts/common/directives/navbar.tpl.html'
        };
    }]);