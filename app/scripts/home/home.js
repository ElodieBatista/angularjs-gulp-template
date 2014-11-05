angular.module('myapp.home')
    .config(function config($routeProvider) {
        $routeProvider
            .when('/home',
            {
                templateUrl: '/home/home.tpl.html',
                controller: 'HomeCtrl'
            });
    })

    .controller('HomeCtrl', ['$scope', 'apiService', function($scope, apiService) {
        $scope.title = 'Hello World';

        apiService.Home.get(function(res) {
            $scope.subtitle = res.data.subtitle;
        });
    }]);