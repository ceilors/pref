// if Game is undefined than user is not authorized
(function(){
    angular.module('prefApp', [])
    .controller('prefController', ['$scope', '$log',
        function($scope, $log) {
            $ = angular.element;
            $scope.gameInit = function() {
                document.getElementById('loading').remove();
                if (typeof Game === 'object') {
                    $log.debug('Game is initialized');
                } else {
                    $log.debug('Game is not initialized');
                }
            }
        }
    ]);
}());
