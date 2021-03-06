(function() {
	'use strict';

	angular
		.module('itinnovdesign.shop-delivery')
		.factory('shopOrderProcessor', shopOrderProcessor);

	shopOrderProcessor.$inject = ['$filter', '$cordovaEmailComposer', '_', '$q'];

	/* @ngInject */
	function shopOrderProcessor($filter, $cordovaEmailComposer, _, $q) {
		var service = {
			performHomeDelivery: performHomeDelivery,
			sendTakeAwayConfirmation: sendTakeAwayConfirmation
		};
		return service;

		// ************************************************

		function sendTakeAwayConfirmation(cart, shop, destination) {
			var confirmation = 'Hi ' + destination.fullname + '<br/>';
			if (destination.phone) {
				confirmation += 'Your phone number ' + destination.phone + '<br/><br/>';
			}

			confirmation += '<b>shop info:</b>';
			confirmation += '<br/>';
			confirmation += 'shop name: ' + shop.name + '<br/>';
			confirmation += 'Address: ' + shop.address + '<br/>';

			confirmation += '<br/>';
			confirmation += '<b>Items:</b>';
			confirmation += '<br/>';
			
			confirmation += formatItemsList(cart);

			var subject = generateSubject();
			return sendEmail(destination.email, subject, confirmation);
		}

		function performHomeDelivery(cart, deliveryData, shopEmail) {
			var order = '';

			order += '<b>Delivery info:</b>'
			order += '<br/>';
			order += 'First name: ' + deliveryData.firstName + '<br/>';
			order += 'Last name: ' + deliveryData.lastName + '<br/>';
			order += 'Email: ' + deliveryData.email + '<br/>';
			order += 'Address: ' + deliveryData.address + '<br/>';
			order += 'Zip code: ' + deliveryData.zipCode + '<br/>';
			order += 'Phone number: ' + deliveryData.phoneNumber + '<br/>';
			order += 'City: ' + deliveryData.city + '<br/>';
			order += 'Country: ' + deliveryData.country + '<br/>';

			order += '<br/>';
			order += '<b>Items:</b>';
			order += '<br/>';

			order += formatItemsList(cart);

			var subject = generateSubject();
			return sendEmail(shopEmail, subject, order);
		}

		function formatItemsList(cart) {
			var order = '';
			var total = 0;
			var currency = '$'
			_.each(cart, function(item) {
				var itemTotal = item.price * item.quantity;
				currency = item.currency;
				order +=
					item.name + ' ' +
					item.quantity + 'x ' +
					item.size + ' ' +
					formatAmount(item.price, item.currency) + '<br/>';

				if (item.options && item.options.length) {
					order += 'Options:<br/>';
					_.each(item.options, function(option) {
						order += '- ' + option.name + ' ' + formatAmount(option.value) + '<br/>';
						itemTotal += option.value * item.quantity;
					});
				}
				order += '<b>Item total:</b> ' + formatAmount(itemTotal, item.currency) + '<br/>';
				total += itemTotal;
			});

			order += '<br/>';
			order += 'Total: ' + formatAmount(total, currency);
			return order;
		}

		function sendEmail(to, subject, body) {
			try {
				return $cordovaEmailComposer.isAvailable().then(function() {
					var email = {
						to: to,
						subject: subject,
						body: body
					};

					$cordovaEmailComposer.open(email);
				});
			} catch (e) {
				return $q.reject('$cordovaEmailComposer is not available or failed. Are you running the app within a browser?');
			}
		}

		function generateSubject() {
			return 'shop Store - Order No ' + Math.floor((Math.random() * 9000) + 1000);
		}
		
		function formatAmount(amount, currency) {
			return $filter('currency')(amount, currency, 2);
		}
	}
})();
