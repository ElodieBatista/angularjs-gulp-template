angular.module('myapp.entity')
    .config(['$routeProvider', function config($routeProvider) {
        $routeProvider
            .when('/entity/action/new',
            {
                templateUrl: '/scripts/modules/entity/action/new/newEntityAction.tpl.html',
                controller: 'NewEntityActionCtrl'
            });
    }])

    .controller('NewEntityActionCtrl', ['$scope', function($scope) {
        $scope.name = 'My new entity action';
    }]);