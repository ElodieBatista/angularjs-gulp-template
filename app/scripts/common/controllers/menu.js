angular.module('myapp.controllers', [])
    .controller('MenuCtrl', ['$scope', function($scope) {
        $scope.menuTitle = 'Hi menu';
    }]);