/**
 * Persons module configuration
 * route <--> template <--> controller
 *
 * @type {config}
 */
angular.module('personsApp')
    .config([
        '$routeProvider',
        function ($routeProvider)
        {
            $routeProvider
                .when('/conference/:mainEventId/persons/list', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-list.html',
                    controller : 'personsListCtrl'
                })
                .when('/persons/list', {
                    templateUrl: globalConfig.app.modules.persons.urls.communityPartials + 'persons-community-thumbnail.html',
                    controller : 'personsCommunityListCtrl'
                })
                .when('/conference/:mainEventId/persons/thumbnail', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-thumbnail.html',
                    controller : 'personsListCtrl'
                })
                .when('/persons/:personId/events', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-events.html',
                    controller : 'personsEventListCtrl'
                })

                .when('/persons/thumbnail', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-thumbnail.html',
                    controller : 'personsListCtrl'
                })
                .when('/persons/new', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-new.html',
                    controller : 'personsNewCtrl'
                })
                .when('/persons/edit/:personId', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-edit.html',
                    controller : 'personsEditCtrl'
                })
                .when('/persons/show/:personId', {
                    templateUrl: globalConfig.app.modules.persons.urls.partials + 'persons-show.html',
                    controller : 'personsShowCtrl'
                })
                .otherwise({
                    redirectTo: '/persons/list'
                });
        }
    ]);