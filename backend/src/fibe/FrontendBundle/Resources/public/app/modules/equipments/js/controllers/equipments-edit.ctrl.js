/**
 * Edit equipment controller
 *
 * @type {controller}
 */
angular.module('equipmentsApp').controller('equipmentsEditCtrl', [ '$scope', '$rootScope', '$routeParams', '$location', 'equipmentsFact', function ($scope, $rootScope, $routeParams, $location, equipmentsFact)
{
    $scope.equipment = equipmentsFact.get({id: $routeParams.equipmentId});

    var error = function (response, args)
    {
        $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'equipments.validations.not_created', type: 'danger'});
    }

    var success = function (response, args)
    {
        $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'equipments.validations.created', type: 'success'});
        $location.path('/equipments/list');
    }

    $scope.update = function (form)
    {
        if (form.$valid)
        {
            $scope.equipment.$update({}, success, error);
        }
    }
}]);