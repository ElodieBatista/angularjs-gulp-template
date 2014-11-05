angular.module('myapp')
    .factory('apiService', ['conf', '$resource', function(conf, $resource) {
        'use strict';
        return {
            Home: /*$resource(conf.epApi + '/home', {}, {
             'get': {
             method: 'GET'
             }*/
                $resource('../json/home.json', {}, {
                    'get': {
                        method: 'GET',
                        isArray: false
                    }
                })
        };
    }]);