App.controller('HomeCtrl',['$scope','$rootScope','users','$timeout','$modal',
	function($scope, $rootScope, users, $timeout, $modal){

		$scope.updatedItems = $scope.items = angular.copy(users);

        $scope.columnWidth = 250;
        $scope.availFilters = [
        	{'name': 'Twubric Score','value' : 'twubric.total'},
        	{'name': 'Friends','value' : 'twubric.friends'},
        	{'name': 'Influence','value' : 'twubric.influence'},
        	{'name': 'Chirpiness','value' : 'twubric.chirpiness'}	
        ]

        $scope.calcGridContainerWidth = function(){
        	var extraMargins = 20;
        	var totalSpaceForGrid = $scope.columnWidth + extraMargins;

        	var noColmsPossible = Math.floor((window.innerWidth)/totalSpaceForGrid);

        	$scope.gridContainerWidth = (noColmsPossible*totalSpaceForGrid);
        }

        $scope.calcGridContainerWidth();

		$scope.sortUsers = function(order){
			$scope.selectedFilter = order;
			if(order == $scope.order){
				order = '-'+order;
				$scope.revOrder = true;
			}else{
				$scope.revOrder = false;
			}
			$scope.order = order;
			$scope.updatedItems = $scope.items;
		}


		window.onresize = function(event) {
		    $scope.calcGridContainerWidth();
		    $scope.items = [];
	    	$scope.loadingItems = true;
	    	$scope.$digest();

		    $timeout(function () {
		    	$scope.loadingItems = false;
				$scope.items = $scope.updatedItems;
		    }, 1000);
		};

		$scope.resetFilters = function(dateOnly){
			$scope.items = [];
			$scope.loadingItems = true;
			$timeout(function () {
				$scope.updatedItems = $scope.items = angular.copy(users);
				$scope.dateIntervalSearched = null;
				if(!dateOnly){
					$scope.order = {};
					$scope.selectedFilter = null;
				}
				$scope.loadingItems = false;
			},500);
		}

		$scope.removeUser = function($index){
			$scope.items.splice($index, 1);
		}

		$scope.dateIntervalSearched = null;
		$scope.openDatePickerModal = function(){
			$scope.datePickerModalInstance = $modal.open({
                templateUrl: "modules/datePicker.html",
                controller: 'DatePickerCtrl',
                keyboard: true,
                resolve: {
                	users: function(){
                		return $scope.items;
                	},
                	dateIntervalSearched: function(){
                		return $scope.dateIntervalSearched;
                	}
                }
            });

			$scope.datePickerModalInstance.result.then(function(filteredData){
				if(filteredData.newFilteredUsers && filteredData.dateInterval){
					$scope.updatedItems = $scope.items = filteredData.newFilteredUsers;
					if(filteredData.dateInterval.startDate && filteredData.dateInterval.endDate){
						$scope.dateIntervalSearched = filteredData.dateInterval;
					}

				}
			});	
		}

	}
]);