angular.module('myapp', [
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngCookies',
    'pascalprecht.translate'
])
    .constant('conf', {
        'epApi': 'http://localhost:4000',
        'epWeb': 'http://localhost:5000'
    })

    .config(['conf', '$routeProvider', '$compileProvider', '$translateProvider', '$httpProvider', function (conf, $routeProvider, $compileProvider, $translateProvider, $httpProvider) {
        'use strict';

        // Default route
        $routeProvider.otherwise({redirectTo: '/home'});

        // Translations
        $translateProvider.useStaticFilesLoader({
            prefix: 'data/locale-',
            suffix: '.json'
        });
        $translateProvider.preferredLanguage('fr');

        // Configure an interceptor to watch for unauthorized service calls
        var interceptor = ['$location', '$q', function($location, $q) {
            function comesFromOwn(url) {
                return (url.indexOf(conf.epApi) !== -1);
            }

            return {
                responseError: function (response) {
                    if (comesFromOwn(response.config.url)) {
                        if (response.status === 401) {
                            console.log('401 detected from the server, exiting local session.');
                            $location.path('/logout');
                        }
                    }
                    return $q.reject(response);
                }
            };
        }];

        $httpProvider.interceptors.push(interceptor);

        // Headers
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/json';
    }])

    .run(['$rootScope', '$http', '$location', '$cookieStore', function ($rootScope, $http, $location, $cookieStore) {
        // Headers
        $http.defaults.headers.common['X-Myapp-AuthToken'] = $cookieStore.get('myapp-token');

        // Executes before route change
        $rootScope.$on('$locationChangeStart', function() {

        });

        $rootScope.$on('$routeChangeStart', function(event, next, current) {
            // If next route is only allowed to authenticated users
            if (next.authRequired === true) {
                $location.path('/login');
            }
        });
    }]);