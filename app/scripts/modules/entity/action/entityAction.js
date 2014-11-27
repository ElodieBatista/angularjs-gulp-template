angular.module('myapp.entity')
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/entity/action',
            {
                templateUrl: '/scripts/modules/entity/action/entityAction.tpl.html',
                controller: 'EntityActionCtrl'
            });
    }])

    .controller('EntityActionCtrl', ['$scope', function($scope) {
        $scope.name = 'My entity action';
    }]);