/**
 * New conference controller
 *
 * @type {controller}
 */
angular.module('mainEventsApp').controller('mainEventsNewCtrl', [ '$scope', '$rootScope', '$location', 'mainEventsFact', 'locationsFact', '$modal', function ($scope, $rootScope, $location, mainEventsFact, locationsFact, $modal)
{
    $scope.conference = new mainEventsFact;

    var error = function (response, args)
    {
        $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'the conference has not been created', type: 'danger'});
    };

    var success = function (response, args)
    {
        $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'conference created', type: 'success'});
        $location.path('/mainEvents/edit/'+response.id);
    };

    $scope.create = function (form)
    {
        if (form.$valid)
        {
            debugger;
            $scope.conference.$create({}, success, error);
        }
    }

    //initialize map zoom
    $scope.center = { zoom: 2 }
    $scope.markers = [];

    var updateMarkers = function (marker) {
        $scope.markers.splice(0, $scope.markers.length);
        $scope.markers.push(marker);
    }


    $scope.addLocation = function ()
    {
        var action = "New";
        if($scope.conference.mainEventlocation) {
            action = "Edit";
        }
        var modalInstance = $modal.open({
            templateUrl: $rootScope.GLOBAL_CONFIG.app.modules.locations.urls.partials + 'locations-modal-form.html',
            controller: 'mainEventLocations'+action+'Ctrl',
            size: "large",
            resolve: {
                locationModel: function () {
                    return $scope.conference.mainEventlocation;
                }
            }
        });
        modalInstance.result.then(function (newLocation) {
            $scope.conference.mainEventlocation = newLocation;
            if(newLocation.latitude){
                updateMarkers({
                    lat: newLocation.latitude,
                    lng: newLocation.longitude,
                    message: "Your event"
                })
            }

        });
    }
}]);
