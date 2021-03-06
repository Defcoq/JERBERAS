(function() {
	'use strict';

	angular
		.module('itinnovdesign-frb-admin.products')
		.factory('editProductService', editProductService);

	editProductService.$inject = ['$rootScope', '$ionicModal', '$q'];

	/* @ngInject */
	function editProductService($rootScope, $ionicModal, $q) {
		var scope = createModal();
		var service = {
			show: show
		};
		return service;
		
		// ***************************************************

		function show(name, description) {
			var defer = $q.defer();

			scope.data = {
				name: name,
				description: description
			}

			scope.cancel = function() {
				scope.modal.hide();
				defer.reject();
			}
			scope.save = function() {
				if (scope.data.name && scope.data.description) {
					scope.modal.hide();
					defer.resolve({
						name: scope.data.name,
						description: scope.data.description
					});
				} else {
					alert('Name and description should be filled');
				}
			}

			scope.modal.show();
			return defer.promise;
		}

		function createModal() {
			var scope = $rootScope.$new();

			$ionicModal.fromTemplateUrl('js/products/edit-product.html', {
				scope: scope
			}).then(function(modal) {
				scope.modal = modal;
			});

			return scope;
		}
	}
})();
