App.controller('DatePickerCtrl',['$scope', '$rootScope', 'users', 'dateIntervalSearched',
	function($scope, $rootScope, users, dateIntervalSearched){
		// console.log(users);

		if(dateIntervalSearched){
			$scope.dateRangeStart = new Date(dateIntervalSearched.startDate*1000);
			$scope.dateRangeEnd = new Date(dateIntervalSearched.endDate*1000);
		}

		$scope.endDateBeforeRender = endDateBeforeRender
		$scope.endDateOnSetTime = endDateOnSetTime
		$scope.startDateBeforeRender = startDateBeforeRender
		$scope.startDateOnSetTime = startDateOnSetTime

		function startDateOnSetTime () {
			$scope.error = null;
		  $scope.$broadcast('start-date-changed');
		}

		function endDateOnSetTime () {
			$scope.error = null;
		  $scope.$broadcast('end-date-changed');
		}

		function startDateBeforeRender ($dates) {
		  if ($scope.dateRangeEnd) {
		    var activeDate = moment($scope.dateRangeEnd);

		    $dates.filter(function (date) {
		      return date.localDateValue() >= activeDate.valueOf()
		    }).forEach(function (date) {
		      date.selectable = false;
		    })
		  }
		}

		function endDateBeforeRender ($view, $dates) {
		  if ($scope.dateRangeStart) {
		    var activeDate = moment($scope.dateRangeStart).subtract(1, $view).add(1, 'minute');

		    $dates.filter(function (date) {
		      return date.localDateValue() <= activeDate.valueOf()
		    }).forEach(function (date) {
		      date.selectable = false;
		    })
		  }
		}

		$scope.filterUsers = function(startDate, endDate){
			// console.log((new Date(startDate).getTime() / 1000).toFixed(0));
			// console.log((new Date(endDate).getTime() / 1000).toFixed(0));
			if(users && !angular.isUndefined(startDate) && !angular.isUndefined(endDate)){
				var newFilteredUsers = [];
				var sDate = Date.parse(startDate)/1000;
				var eDate = Date.parse(endDate)/1000;

				for(var i=0; i<users.length; i++){
					join_date = users[i].join_date;

					if(users[i].join_date){
						if(sDate < join_date && join_date < eDate){
							newFilteredUsers.push(users[i]);
						}
					}
				}
				dateInterval = {'startDate':sDate, 'endDate':eDate};
				data = {'newFilteredUsers':newFilteredUsers,'dateInterval':dateInterval};

				$scope.datePickerModal.close(data);				
			}else{
				$scope.error = "Please select both the dates to proceed.";
			}
		}

		$scope.datePickerModal = {
	        dismiss : function(){
	        	$scope.$dismiss();
            },
	        close: function(data){
	          $scope.$close(data);
	        }
	    };

	}
]);