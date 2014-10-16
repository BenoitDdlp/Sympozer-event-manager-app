/**
 * List events controller
 *
 * @type {controller}
 */
angular.module('eventsApp').controller('eventsListCtrl', ['$scope', 'categoriesFact', '$routeParams', 'GLOBAL_CONFIG', 'createDialog', '$rootScope', 'eventsFact', '$cachedResource', function ($scope, categoriesFact, $routeParams, GLOBAL_CONFIG, createDialogService, $rootScope, eventsFact, $cachedResource)
{

    //Context change
    //$rootScope.$broadcast('contextCtrl:changeContext', {mainEventId:$routeParams.mainEventId});

    $scope.entities = [];
    $scope.categories = categoriesFact.all({'filters[mainEventId]': $routeParams.mainEventId});

    var baseFilters;
    if ($routeParams.mainEventId)
    {
        $scope.filters = baseFilters = {
            mainEventId: $routeParams.mainEventId
        };
    }


    $scope.reload = function ()
    {
        $scope.events.$promise.then(function ()
        {
            console.log('From cache:', $scope.events);
        });
    }

    $scope.clone = function (event, index)
    {

        var cloneEvent = angular.copy(event);
        delete cloneEvent.id;

        var error = function (response, args)
        {
            $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'Clone not completed', type: 'danger'});
        }

        var success = function (response, args)
        {
            $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'Event saved', type: 'success'});
            $scope.entities.splice(index + 1, 0, response);
        }

        cloneEvent.$create({}, success, error);
    }

    $scope.deleteModal = function (index, event)
    {
        $scope.index = index;

        createDialogService(GLOBAL_CONFIG.app.modules.events.urls.partials + 'events-delete.html', {
            id        : 'complexDialog',
            title     : 'Event deletion',
            backdrop  : true,
            controller: 'eventsDeleteCtrl',
            success   : {label: 'Ok', fn: function ()
            {
                eventsFact.delete({id: event.id});
                $scope.entities.splice(index, 1);
            }}
        }, {
            eventModel: event
        });
    }

}]);