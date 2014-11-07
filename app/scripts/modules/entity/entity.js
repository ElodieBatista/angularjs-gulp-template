angular.module('myapp.entity', [])
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/entity',
            {
                templateUrl: '/scripts/modules/entity/entity.tpl.html',
                controller: 'EntityCtrl'
            });
    }])

    .controller('EntityCtrl', ['$scope', function($scope) {
        $scope.name = 'My entity';
    }]);