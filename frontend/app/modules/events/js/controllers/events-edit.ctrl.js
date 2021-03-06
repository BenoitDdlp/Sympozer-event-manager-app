/**
 * Edit event controller
 *
 * @type {controller}
 */
angular.module('eventsApp').controller('eventsEditCtrl', [
  '$scope',
  '$rootScope',
  '$filter',
  '$window',
  '$q',
  'GLOBAL_CONFIG',
  '$routeParams',
  '$location',
  'eventsFact',
  'categoriesFact',
  'topicsFact',
  'locationsFact',
  'papersFact',
  'personsFact',
  'roleLabelsFact',
  '$modal',
  'pinesNotifications',
  'translateFilter',
  function ($scope, $rootScope, $filter, $window, $q, GLOBAL_CONFIG, $routeParams, $location, eventsFact, categoriesFact, topicsFact, locationsFact, papersFact, personsFact, roleLabelsFact, $modal, pinesNotifications, translateFilter)
  {
    var dateFormat = "dd DD MMM YYYY";


    var fetchSuccess = function (event)
    {

      //Initialize the day dropdown value and time inputs
      if (event.startAt)
      {
        $scope.event.selectedDay = new moment(event.startAt).format(dateFormat);
        //Initialize the timer for start time
        $scope.event.timeStart = new Date(event.startAt);
      }
      else
      {
        $scope.event.selectedDay = new moment($rootScope.currentMainEvent.startAt).format(dateFormat);
        //Initialize the timer for start time
        $scope.event.timeStart = new Date().setHours('12');
      }

      //Initialize the day dropdown value and time inputs
      if (event.endAt)
      {
        //Initialize the timer for end time
        $scope.event.timeEnd = new Date(event.endAt);
      }
      else
      {
        //Initialize the timer for end time
        $scope.event.timeEnd = new Date().setHours('13');
      }


    };

    //Get the event from id in the route or directly in injected id (in case of a modal view)
    if ($scope.eventId)
    {
      $scope.event = eventsFact.get({id: $scope.eventId}, fetchSuccess);
      $scope.modalTitle = 'events.actions.edit';
    }
    else
    {
      $scope.event = eventsFact.get({id: $routeParams.eventId}, fetchSuccess);
    }


    //Error on event edit request
    var error = function (response, args)
    {
      //Notify of the creation action error
      pinesNotifications.notify({
        title: translateFilter('global.validations.error'),
        text: translateFilter('events.validations.not_created'),
        type: 'error'
      });
    };

    //Success on event request
    var success = function (response, args)
    {
      //Notify of the creation action success
//            pinesNotifications.notify({
//                title: translateFilter('global.validations.success'),
//                text: translateFilter('events.validations.created'),
//                type: 'success'
//            });
      //If view is a modal instance then close (resolve promise with new role)
      if ($scope.$close)
      {
        $scope.$close($scope.event);
      }
      else
      {
        //If view is a page, go back to previous page
        $window.history.back();
      }
    };


    /**
     * Convert the selected day + selected and time and selected start time to actual dates.
     * Validates end > start
     * @returns {boolean}
     */
    var setStartEndDates = function ()
    {
      if ($scope.event.selectedDay)
      {
        //Initialize start date from the selected day
        $scope.event.startAt = moment($scope.event.selectedDay, dateFormat);
        //Set hours from timer for start value
        $scope.event.startAt.set("h", $scope.event.timeStart.getHours());
        //Set minutes from timer for start value
        $scope.event.startAt.set("m", $scope.event.timeStart.getMinutes());

        //Initialize end date from the selected day
        $scope.event.endAt = moment($scope.event.selectedDay, dateFormat);
        //Set hours from timer for end value
        $scope.event.endAt.set("h", $scope.event.timeEnd.getHours());
        //Set minutes from timer for end value
        $scope.event.endAt.set("m", $scope.event.timeEnd.getMinutes());

        //Validate start < end date
        return $scope.event.startAt.isBefore($scope.event.endAt);
      }else{
          //Reset dates
          delete($scope.event.endAt);
          delete($scope.event.startAt);
          return true;
      }

    };

    //Send put request to the server
    $scope.save = function (form)
    {
      //Verify form validity
      if (form.$valid && setStartEndDates())
      {
        eventsFact.update(eventsFact.serialize($scope.event), success, error);
      }
    };

    //Populate array of a specific linked entity
    $scope.addRelationship = function (key, model)
    {
      //Check if array available for the linked entity
      if (!$scope.event[key])
      {
        $scope.event[key] = [];
      }

      //Stop if the object selected is already in array (avoid duplicates)
      if (!$filter('inArray')('id', model.id, $scope.event[key]))
      {
        //If no duplicate add the selected object to the specified array
        $scope.event[key].push(model);
      }
    };

    $scope.removeRelationship = function (key, index)
    {
      $scope.event[key].splice(index, 1);
    };


//        $scope.createLocationModal = function ()
//        {
//            //TODO : fix this
//            createDialogService(GLOBAL_CONFIG.app.modules.locations.urls.partials + 'modals/locations-new.html', {
//                id        : 'complexDialog',
//                title     : 'New location',
//                backdrop  : true,
//                controller: 'locationsNewCtrl',
//                success   : {label: 'Save', fn: function ()
//                {
//                }}
//            }, {
//            });
//        };

    //Autocomplete and add paper workflow
    $scope.searchCategories = categoriesFact.allByConference;
    $scope.addCategory = function (categoryModel)
    {
      if (!categoryModel.id)
      {
        //If topic doesn't exist, create it
        categoriesFact.create(categoriesFact.serialize({label: categoryModel}), function (category)
        {
          $scope.event.category = category;

        }, function (error)
        {
          //Notify of the creation action error
          pinesNotifications.notify({
            title: translateFilter('global.validations.error'),
            text: translateFilter('categories.validations.not_created'),
            type: 'error'
          });
        });
      }
      else
      {
        $scope.event.category = categoryModel;
      }
    };

    //Autocomplete and add paper workflow
    $scope.searchTopics = topicsFact.all;
    $scope.addTopic = function (topicModel)
    {
      if (!topicModel.id)
      {
        //If topic doesn't exist, create it
        topicsFact.create(topicsFact.serialize({label: topicModel}), function (topic)
        {
          $scope.addRelationship('topics', topic);

        }, function (error)
        {
          //Notify of the creation action error
          pinesNotifications.notify({
            title: translateFilter('global.validations.error'),
            text: translateFilter('topics.validations.not_created'),
            type: 'error'
          });
        });
      }
      else
      {
        $scope.addRelationship('topics', topicModel)
      }
    };

    //Autocomplete and add location workflow
    $scope.searchLocations = locationsFact.allByConference;
    $scope.addLocation = function (locationModel)
    {
      if (!locationModel.id)
      {
        var modalInstance = $modal.open({
          templateUrl: GLOBAL_CONFIG.app.modules.locations.urls.partials + 'modals/locations-modal-form.html',
          controller: 'locationsNewCtrl',
          size: "large",
          resolve: {}
        });
        modalInstance.result.then(function (newLocation)
        {
          $scope.event.location = newLocation;
        }, function ()
        {
          //$log.info('Modal dismissed at: ' + new Date());
        });
      }
      else
      {
        $scope.event.location = locationModel;
      }
    };


    //Autocomplete and add paper workflow
    $scope.searchPapers = papersFact.all;
    $scope.event.papers = [];
    $scope.addPaper = function (paperModel)
    {
      if (!paperModel.id)
      {
        var modalInstance = $modal.open({
          templateUrl: GLOBAL_CONFIG.app.modules.papers.urls.partials + 'modals/papers-modal-form.html',
          controller: 'papersNewCtrl',
          size: "large",
          resolve: {}
        });
        modalInstance.result.then(function (newPaper)
        {
          $scope.addRelationship('papers', newPaper);
        }, function ()
        {
          //$log.info('Modal dismissed at: ' + new Date());
        });
      }
      else
      {
        $scope.addRelationship('papers', paperModel);

      }
    };


    //Autocomplete and add role workflow
    $scope.event.roles = [];
    $scope.addRole = function (role)
    {
      $scope.event.roles.push($.extend(true, {}, role));
      role.person = "";
      role.roleLabel = "";
    };


    //Promise needed by the typeahead directive, resolved when something is selected
    $scope.getPersons = function (val)
    {
      //Fetch organization filter by the query and resolve the promise when results comes back
      var deferred = $q.defer();
      personsFact.all({query: val}, function (persons)
      {
        deferred.resolve(persons.results);
      });
      return deferred.promise;
    };

    //Promise needed by the typeahead directive, resolved when something is selected
    $scope.getRoleLabels = function (val)
    {
      //Fetch organization filter by the query and resolve the promise when results comes back
      var deferred = $q.defer();
      roleLabelsFact.all({query: val}, function (roleLabel)
      {
        deferred.resolve(roleLabel.results);
      });
      return deferred.promise;
    };

    //Remove a role from the event role list by index
    $scope.deleteRole = function (index)
    {
      $scope.event.roles.splice(index, 1);
    };

    //Delete the location of the event
    $scope.deleteLocation = function ()
    {
      delete $scope.event.location;
    }

    //Delete the category of the event
    $scope.deleteCategory = function ()
    {
      delete $scope.event.category;
    }

    //Delete a paper from the event paper list using its index
    $scope.deletePaper = function (index)
    {
      $scope.removeRelationship('papers', index)
    }
  }]);
