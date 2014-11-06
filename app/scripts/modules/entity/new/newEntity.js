angular.module('myapp.entity')
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/entity/new',
            {
                templateUrl: '/scripts/modules/entity/new/newEntity.tpl.html',
                controller: 'NewEntityCtrl'
            });
    }])

    .controller('NewEntityCtrl', ['$scope', function($scope) {
        $scope.name = 'My new entity';
    }]);