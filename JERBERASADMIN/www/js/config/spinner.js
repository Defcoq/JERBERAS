(function() {
	'use strict';

	angular
		.module('itinnovdesign-frb-admin')
		.config(function($httpProvider) {
			$httpProvider.interceptors.push(function($rootScope, $q) {
				return {
					request: function(config) {
						if (config.url.indexOf('http') === 0) {
							$rootScope.$broadcast('loading:show');
						}
						return config;
					},
					response: function(response) {
						$rootScope.$broadcast('loading:hide');
						return response;
					},
					requestError: function(rejectReason) {
						$rootScope.$broadcast('loading:hide');
						return $q.reject(rejectReason);
					},
					responseError: function(rejectReason) {
						$rootScope.$broadcast('loading:hide');
						return $q.reject(rejectReason);
					}
				};
			});
		})
		.run(function($rootScope, $ionicLoading) {
			$rootScope.$on('loading:show', function() {
				$ionicLoading.show({});
			});

			$rootScope.$on('loading:hide', function() {
				$ionicLoading.hide();
			});
		});
})();