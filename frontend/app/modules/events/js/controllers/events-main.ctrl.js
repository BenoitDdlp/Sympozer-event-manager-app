/**
 * Main events controller
 *
 * @type {controller}
 */
angular.module('eventsApp').controller('eventsMainCtrl', [function ($scope){

    /**
     * Action that toggle the right bar
     */
    $rootScope.toggleRightBar = function ()
    {
        $uiConfig.set('events-filterBarCollapsed', !$scope.style_events-filterBarCollapsed);
    };

}]);
