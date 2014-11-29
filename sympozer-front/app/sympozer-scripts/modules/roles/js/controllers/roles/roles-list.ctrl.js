/**
 * List roles controller
 *
 * @type {controller}
 */
angular.module('rolesApp').controller('rolesListCtrl', [
    '$scope', 'roleLabelsFact', '$routeParams', 'GLOBAL_CONFIG', '$rootScope', 'rolesFact', '$cachedResource', '$modal', function ($scope, roleLabelsFact, $routeParams, GLOBAL_CONFIG, $rootScope, rolesFact, $cachedResource, $modal)
    {
        $scope.GLOBAL_CONFIG = GLOBAL_CONFIG;
        $scope.entities = [];

        $scope.filters = {};

         roleLabelsFact.allByConference({'mainEventId': $routeParams.mainEventId}, function(response){
             $scope.roleLabelVersions = response.results;
        });

        $scope.request = rolesFact.allByConference;
        $scope.filters.roleLabelVersionIds = [];

        $scope.addRoleLabelsFilter= function(roleLabelVersionId){
            var roleLabelVersionIndex = $scope.filters.roleLabelVersionIds.indexOf(roleLabelVersionId)
            if( roleLabelVersionIndex == -1){
                $scope.filters.roleLabelVersionIds.push(roleLabelVersionId);
            }else{
                $scope.filters.roleLabelVersionIds.splice(roleLabelVersionIndex, 1);
            }
            $scope.filter();
        }


        $scope.reload = function ()
        {
            $scope.entities.$promise.then(function ()
            {
                console.log('From cache:', $scope.entities);
            });
        };

        $scope.clone = function (role)
        {
            var clonerole = angular.copy(role);
            delete clonerole.id;

            var error = function (response, args)
            {
                $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'Clone not completed', type: 'danger'});
            };

            var success = function (response, args)
            {
                $rootScope.$broadcast('AlertCtrl:addAlert', {code: 'role saved', type: 'success'});
                $scope.entities.push(response);
            };

            clonerole.$create({}, success, error);
        };



        $scope.deleteModal = function (index, role)
        {
            $scope.index = index;

            var modalInstance = $modal.open({
                templateUrl: GLOBAL_CONFIG.app.modules.roles.urls.partials + 'modals/roles-delete-modal.html',
                controller: 'rolesDeleteCtrl',
                size: "large",
                resolve: {
                   roleModel : function(){
                        return $modal;
                    }
                }
            });

            modalInstance.resolve = function(data){
                $scope.entities.splice(index, 1);
            }
        }

//        $scope.deleteModal = function (index, role)
//        {
//            $scope.index = index;
//
//            createDialogService(GLOBAL_CONFIG.app.modules.roles.urls.partials + 'roles-delete.html', {
//                id        : 'complexDialog',
//                title     : 'role deletion',
//                backdrop  : true,
//                controller: 'rolesDeleteCtrl',
//                success   : {label: 'Ok', fn: function ()
//                {
//                    rolesFact.delete({id: role.id});
//                    $scope.entities.splice(index, 1);
//                }}
//            }, {
//                roleModel: role
//            });
//        }

    }]);
