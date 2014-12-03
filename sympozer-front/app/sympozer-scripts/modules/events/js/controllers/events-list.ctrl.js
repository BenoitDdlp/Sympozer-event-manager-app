/**
 * List events controller
 *
 * @type {controller}
 */
angular.module('eventsApp').controller('eventsListCtrl', [
    '$scope', 'categoriesFact', '$routeParams', 'GLOBAL_CONFIG', '$rootScope', 'eventsFact', function ($scope, categoriesFact, $routeParams, GLOBAL_CONFIG, $rootScope, eventsFact)
    {

        //Context change
        //$rootScope.$broadcast('contextCtrl:changeContext', {mainEventId:$routeParams.mainEventId});

        $scope.entities = [];

        categoriesFact.allByConference({'mainEventId': $routeParams.mainEventId}, function(response){
            $scope.categories = response.results;
        });

        $scope.request = eventsFact.allByConference;

        $scope.filters = {};
        $scope.filters.categoryVersionIds = [];

        var i = 0; // clone counter

        $scope.addCategoriesFilter = function (categoryVersionId)
        {
            var categoryVersionIndex = $scope.filters.categoryVersionIds.indexOf(categoryVersionId);
            if (categoryVersionIndex == -1)
            {
                $scope.filters.categoryVersionIds.push(categoryVersionId);
            }
            else
            {
                $scope.filters.categoryVersionIds.splice(categoryVersionIndex, 1);
            }
            $scope.filter();
        };

        $scope.reload = function ()
        {
            $scope.events.$promise.then(function ()
            {
                console.log('From cache:', $scope.events);
            });
        };

        $scope.clone = function (event, index)
        {

            var cloneEvent = angular.copy(event);
            delete cloneEvent.id;
            cloneEvent.label = cloneEvent.label + "(" + (++i) + ")";

            var error = function (response, args)
            {
                $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'Clone not completed', type: 'danger'});
            };

            var success = function (response, args)
            {
                $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'Event saved', type: 'success'});
                $scope.entities.splice(index + 1, 0, response);
            };

            cloneEvent.$create({}, success, error);
        };


        //Handle remove a category from the list
        $scope.deleteModal = function (index, event)
        {
            //Store index of the object in the tab for further deletion
            $scope.index = index;

            //Open a new modal with delete template
            var modalInstance = $modal.open({
                templateUrl: GLOBAL_CONFIG.app.modules.events.urls.partials + 'modals/events-delete-modal.html',
                controller: 'eventsDeleteCtrl',
                size: "large",
                resolve: {
                    eventModel : function(){
                        return event;
                    }
                }
            });

            //When modal instance promise is resolved with 'ok' then remove the cateogy from the list
            modalInstance.resolve = function(){
                $scope.entities.splice(index, 1);
            }
        }


//        $scope.deleteModal = function (index, event)
//        {
//            $scope.index = index;
//
//            createDialogService(GLOBAL_CONFIG.app.modules.events.urls.partials + 'events-delete.html', {
//                id        : 'complexDialog',
//                title     : 'Event deletion',
//                backdrop  : true,
//                controller: 'eventsDeleteCtrl',
//                success   : {label: 'Ok', fn: function ()
//                {
//                    eventsFact.delete({id: event.id});
//                    $scope.entities.splice(index, 1);
//                }}
//            }, {
//                eventModel: event
//            });
//        }

    }]);
