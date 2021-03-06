/**
 * New label role controller
 *
 * @type {controller}
 */
angular.module('roleLabelsApp').controller('roleLabelsNewCtrl',
    [ '$scope', '$routeParams', '$window', '$rootScope', '$location', 'roleLabelsFact', function ($scope, $routeParams, $window, $rootScope, $location, roleLabelsFact)
    {
        $scope.roleLabel = new roleLabelsFact;

        var error = function (response, args)
        {
            $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'roleLabelVersions.validations.not_created', type: 'danger'});
        };

        var success = function (response, args)
        {
            $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'roleLabelVersions.validations.created', type: 'success'});
            if($scope.$close){
                $scope.$close($scope.roleLabel);
            }else{
                $window.history.back();
            }

        };

        $scope.create = function (form)
        {
            $scope.roleLabel.mainEvent = $routeParams.mainEventId;
            if (form.$valid)
            {
                $scope.roleLabel.$create({}, success, error);
            }
        }

        $scope.cancel = function () {
            $scope.$dismiss('cancel');
        };
    }]);