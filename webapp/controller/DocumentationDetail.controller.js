sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller,JSONModel,Filter,FilterOperator) {
	"use strict";

	return Controller.extend("org.at.UI5Documentation.controller.DocumentationDetail", {

		onInit : function () {
			
			var detailHelperModel = new JSONModel({
				delay: 0,
				busy : false,
				applicationsDialogTitle: ""
			//	title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterTitleCount", [0]),
			});
			this.getView().setModel(detailHelperModel, "detailHelper");
			
			this.getOwnerComponent().getRouter().getRoute("object").attachPatternMatched(this._onObjectMatched, this);
			this.getOwnerComponent().getModel().metadataLoaded().then(this._onMetadataLoaded.bind(this));
		},

		showComponentsForCatalog:function(event){
			
			if (!this._applicationsDialog) {
				this._applicationsDialog = sap.ui.xmlfragment("org.at.UI5Documentation.fragment.Applications", this);
			}
			
			this.getView().addDependent(this._applicationsDialog);
			this.getView().getModel("detailHelper").setProperty("/applicationsDialogTitle","Applications for Catalog " + event.getSource().getText());
			this._applicationsDialog.getBinding("items").filter(new Filter("CatalogID", FilterOperator.EQ, event.getSource().getText()));
			this._applicationsDialog.open();
		
		},

		showComponentsForRole:function(event){
			
			if (!this._applicationsDialog) {
				this._applicationsDialog = sap.ui.xmlfragment("org.at.UI5Documentation.fragment.Applications", this);
			}
			
			this.getView().addDependent(this._applicationsDialog);
			this.getView().getModel("detailHelper").setProperty("/applicationsDialogTitle","Applications for Role " + event.getSource().getText());
			this._applicationsDialog.getBinding("items").filter(new Filter("RoleName", FilterOperator.EQ, event.getSource().getText()));
			this._applicationsDialog.open();
		
		},
		
		_onObjectMatched : function (oEvent) {
			var sObjectId =  oEvent.getParameter("arguments").objectId;
			this.getView().getModel().metadataLoaded().then( function() {
				var sObjectPath = this.getView().getModel().createKey("UI5Applications", {
					ComponentID :  sObjectId
				});
				this._bindView("/" + sObjectPath);
			}.bind(this));
		},

		_bindView : function (sObjectPath) {
			
			var oViewModel = this.getView().getModel("detailHelper");
			oViewModel.setProperty("/busy", false);
			
			this.getView().bindElement({
				path : sObjectPath,
				events: {
					change : this._onBindingChange.bind(this),
					dataRequested : function () {
						oViewModel.setProperty("/busy", true);
					},
					dataReceived: function () {
				 		oViewModel.setProperty("/busy", false);
					}
				}
			});
		},

		_onBindingChange : function () {
			
			var oView = this.getView();
		    var oElementBinding = oView.getElementBinding();
			var sPath = oElementBinding.getPath();

			this.getOwnerComponent().oListSelector.selectAListItem(sPath);
		},
		
		_onMetadataLoaded : function () {
			// Store original busy indicator delay for the detail view
			var iOriginalViewBusyDelay = this.getView().getBusyIndicatorDelay();
			var oViewModel = this.getView().getModel("detailHelper");

			oViewModel.setProperty("/delay", 0);
	//		oViewModel.setProperty("/busy", true);
			
			// Restore original busy indicator delay for the detail view
			oViewModel.setProperty("/delay", iOriginalViewBusyDelay);
		}
			
	});
});