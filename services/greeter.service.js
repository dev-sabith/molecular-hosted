"use strict";

let ApiContracts = require("authorizenet").APIContracts;
let ApiControllers = require("authorizenet").APIControllers;
// let SDKConstants = require("authorizenet").Constants;
// let utils = require("../utils.js");
// let constants = require("../constants.js");

/**
 * @typedef {import('moleculer').Context} Context Moleculer's Context
 */

module.exports = {
	name: "greeter",

	/**
	 * Settings
	 */
	settings: {},

	/**
	 * Dependencies
	 */
	dependencies: [],

	/**
	 * Actions
	 */
	actions: {
		/**
		 * Say a 'Hello' action.
		 *
		 * @returns
		 */
		hello: {
			rest: {
				method: "GET",
				path: "/hello",
			},
			async handler() {
				return "Hello Moleculer";
			},
		},

		notifications: {
			rest: {
				method: "POST",
				path: "/notifications",
			},
			async handler(ctx) {
				console.log(">>>>>>>>>>>>>>>>>>>>>>>>>>>>>>notifications");
				console.log(ctx.params);
				return "Hello Moleculer";
			},
		},

		/**
		 * Welcome, a username
		 *
		 * @param {String} name - User name
		 */
		doPayment: {
			rest: {
				method: "POST",
				path: "/doPayment",
			},
			params: {
				name: "string",
			},
			/** @param {Context} ctx  */
			async handler(ctx) {
				// return `Welcome, ${ctx.params.name}`;
				const merchantAuthenticationType =
					new ApiContracts.MerchantAuthenticationType();
				merchantAuthenticationType.setName("3c86kQEb");
				merchantAuthenticationType.setTransactionKey(
					"94hQ3Yk2F82yx7D2"
				);

				const creditCard = new ApiContracts.CreditCardType();
				creditCard.setCardNumber("4242424242424242");
				creditCard.setExpirationDate("0822");
				creditCard.setCardCode("999");

				const paymentType = new ApiContracts.PaymentType();
				paymentType.setCreditCard(creditCard);

				const orderDetails = new ApiContracts.OrderType();
				orderDetails.setInvoiceNumber("INV-12345");
				orderDetails.setDescription("Product Description");

				const tax = new ApiContracts.ExtendedAmountType();
				tax.setAmount("4.26");
				tax.setName("level2 tax name");
				tax.setDescription("level2 tax");

				const duty = new ApiContracts.ExtendedAmountType();
				duty.setAmount("8.55");
				duty.setName("duty name");
				duty.setDescription("duty description");

				const shipping = new ApiContracts.ExtendedAmountType();
				shipping.setAmount("8.55");
				shipping.setName("shipping name");
				shipping.setDescription("shipping description");

				const billTo = new ApiContracts.CustomerAddressType();
				billTo.setFirstName("Ellen");
				billTo.setLastName("Johnson");
				billTo.setCompany("Souveniropolis");
				billTo.setAddress("14 Main Street");
				billTo.setCity("Pecan Springs");
				billTo.setState("TX");
				billTo.setZip("44628");
				billTo.setCountry("USA");

				const shipTo = new ApiContracts.CustomerAddressType();
				shipTo.setFirstName("China");
				shipTo.setLastName("Bayles");
				shipTo.setCompany("Thyme for Tea");
				shipTo.setAddress("12 Main Street");
				shipTo.setCity("Pecan Springs");
				shipTo.setState("TX");
				shipTo.setZip("44628");
				shipTo.setCountry("USA");

				const lineItem_id1 = new ApiContracts.LineItemType();
				lineItem_id1.setItemId("1");
				lineItem_id1.setName("vase");
				lineItem_id1.setDescription("cannes logo");
				lineItem_id1.setQuantity("18");
				lineItem_id1.setUnitPrice(45.0);

				const lineItem_id2 = new ApiContracts.LineItemType();
				lineItem_id2.setItemId("2");
				lineItem_id2.setName("vase2");
				lineItem_id2.setDescription("cannes logo2");
				lineItem_id2.setQuantity("28");
				lineItem_id2.setUnitPrice("25.00");

				let lineItemList = [];
				lineItemList.push(lineItem_id1);
				lineItemList.push(lineItem_id2);

				const lineItems = new ApiContracts.ArrayOfLineItem();
				lineItems.setLineItem(lineItemList);

				const userField_a = new ApiContracts.UserField();
				userField_a.setName("A");
				userField_a.setValue("Aval");

				const userField_b = new ApiContracts.UserField();
				userField_b.setName("B");
				userField_b.setValue("Bval");

				let userFieldList = [];
				userFieldList.push(userField_a);
				userFieldList.push(userField_b);

				const userFields =
					new ApiContracts.TransactionRequestType.UserFields();
				userFields.setUserField(userFieldList);

				const transactionSetting1 = new ApiContracts.SettingType();
				transactionSetting1.setSettingName("duplicateWindow");
				transactionSetting1.setSettingValue("120");

				const transactionSetting2 = new ApiContracts.SettingType();
				transactionSetting2.setSettingName("recurringBilling");
				transactionSetting2.setSettingValue("false");

				let transactionSettingList = [];
				transactionSettingList.push(transactionSetting1);
				transactionSettingList.push(transactionSetting2);

				const transactionSettings = new ApiContracts.ArrayOfSetting();
				transactionSettings.setSetting(transactionSettingList);

				const transactionRequestType =
					new ApiContracts.TransactionRequestType();
				transactionRequestType.setTransactionType(
					ApiContracts.TransactionTypeEnum.AUTHCAPTURETRANSACTION
				);
				transactionRequestType.setPayment(paymentType);
				transactionRequestType.setAmount("600");
				transactionRequestType.setLineItems(lineItems);
				transactionRequestType.setUserFields(userFields);
				transactionRequestType.setOrder(orderDetails);
				transactionRequestType.setTax(tax);
				transactionRequestType.setDuty(duty);
				transactionRequestType.setShipping(shipping);
				transactionRequestType.setBillTo(billTo);
				transactionRequestType.setShipTo(shipTo);
				transactionRequestType.setTransactionSettings(
					transactionSettings
				);

				let createRequest = new ApiContracts.CreateTransactionRequest();
				createRequest.setMerchantAuthentication(
					merchantAuthenticationType
				);
				createRequest.setTransactionRequest(transactionRequestType);

				//pretty print request
				// console.log(JSON.stringify(createRequest.getJSON(), null, 2));

				let ctrl = new ApiControllers.CreateTransactionController(
					createRequest.getJSON()
				);
				//Defaults to sandbox
				//ctrl.setEnvironment(SDKConstants.endpoint.production);
				return new Promise((resolve,reject)=>{
					ctrl.execute(function(){

						let apiResponse = ctrl.getResponse();
				
						let response = new ApiContracts.CreateTransactionResponse(apiResponse);
				
						//pretty print response
						console.log(JSON.stringify(response, null, 2));
				
						if(response != null){
							if(response.getMessages().getResultCode() == ApiContracts.MessageTypeEnum.OK){
								if(response.getTransactionResponse().getMessages() != null){
									console.log('Successfully created transaction with Transaction ID: ' + response.getTransactionResponse().getTransId());
									console.log('Response Code: ' + response.getTransactionResponse().getResponseCode());
									console.log('Message Code: ' + response.getTransactionResponse().getMessages().getMessage()[0].getCode());
									console.log('Description: ' + response.getTransactionResponse().getMessages().getMessage()[0].getDescription());
									resolve({
										transactionId:response.getTransactionResponse().getTransId(),
										responseCode:response.getTransactionResponse().getResponseCode(),
										messageCode:response.getTransactionResponse().getMessages().getMessage()[0].getCode(),
										message:response.getTransactionResponse().getMessages().getMessage()[0].getDescription()
									});
								}
								else {
									console.log('Failed Transaction.');
									if(response.getTransactionResponse().getErrors() != null){
										console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
										console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
										reject({
											errorCode:response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
											message:response.getTransactionResponse().getErrors().getError()[0].getErrorText()
										});
									}
								}
							}
							else {
								console.log('Failed Transaction. ');
								if(response.getTransactionResponse() != null && response.getTransactionResponse().getErrors() != null){
								
									console.log('Error Code: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorCode());
									console.log('Error message: ' + response.getTransactionResponse().getErrors().getError()[0].getErrorText());
									reject({
										errorCode:response.getTransactionResponse().getErrors().getError()[0].getErrorCode(),
										message:response.getTransactionResponse().getErrors().getError()[0].getErrorText()
									});
								}
								else {
									console.log('Error Code: ' + response.getMessages().getMessage()[0].getCode());
									console.log('Error message: ' + response.getMessages().getMessage()[0].getText());
									reject({
										errorCode:response.getMessages().getMessage()[0].getCode(),
										message:response.response.getMessages().getMessage()[0].getText()
									});
								}
							}
						}
						else {
							console.log('Null Response.');
						}
				
						// return response;
					});

				});
				
			},
		},
	},

	/**
	 * Events
	 */
	events: {},

	/**
	 * Methods
	 */
	methods: {},

	/**
	 * Service created lifecycle event handler
	 */
	created() {},

	/**
	 * Service started lifecycle event handler
	 */
	async started() {},

	/**
	 * Service stopped lifecycle event handler
	 */
	async stopped() {},
};
