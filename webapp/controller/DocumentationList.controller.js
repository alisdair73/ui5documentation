sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/model/Sorter",
	"sap/m/GroupHeaderListItem",
	"sap/ui/model/Filter",
	"sap/ui/model/FilterOperator"
], function(Controller, JSONModel,Sorter,GroupHeaderListItem,Filter,FilterOperator) {
	"use strict";

	return Controller.extend("org.at.UI5Documentation.controller.DocumentationList", {

		onInit: function() {

			var listHelperModel = new JSONModel({
				delay: 0,
				title: this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterTitleCount", [0]),
			});

			this.getView().setModel(listHelperModel, "listHelper");

			this._oList = this.byId("documentationList");
			
			this._oListFilterState = {
				aFilter : [],
				aSearch : []
			};
				
			this._oList.attachEventOnce("updateFinished", function(){
				// Restore original busy indicator delay for the list
				listHelperModel.setProperty("/delay", this._oList.getBusyIndicatorDelay());
			}.bind(this));
				
			this.getView().addEventDelegate({
				onBeforeFirstShow: function () {
					this.getOwnerComponent().oListSelector.setBoundMasterList(this._oList);
				}.bind(this)
			});
				
			this.getOwnerComponent().getRouter().getRoute("master").attachPatternMatched(this._onDocumentationListMatched, this);
			this.getOwnerComponent().getRouter().attachBypassed(this._onBypassed, this);
		},

		onSearch : function (oEvent) {
			if (oEvent.getParameters().refreshButtonPressed) {
				// Search field's 'refresh' button has been pressed.
				// This is visible if you select any master list item.
				// In this case no new search is triggered, we only
				// refresh the list binding.
				this.onRefresh();
				return;
			}

			var sQuery = oEvent.getParameter("query");

			if (sQuery) {
				this._oListFilterState.aSearch = [new Filter("Description", FilterOperator.Contains, sQuery)];
			} else {
				this._oListFilterState.aSearch = [];
			}
			this._applyFilterSearch();
		},
			
		_applyFilterSearch : function () {
			var aFilters = this._oListFilterState.aSearch.concat(this._oListFilterState.aFilter);
			//var oViewModel = this.getView().getModel("masterView");
			
			this._oList.getBinding("items").filter(aFilters, "Application");
			
			// changes the noDataText of the list in case there are no filter results
/*			if (aFilters.length !== 0) {
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataWithFilterOrSearchText"));
			} else if (this._oListFilterState.aSearch.length > 0) {
				// only reset the no data text to default when no new search was triggered
				oViewModel.setProperty("/noDataText", this.getResourceBundle().getText("masterListNoDataText"));
			}*/
		},
			
		createGroupHeader : function (oGroup) {
			return new GroupHeaderListItem({
				title : oGroup.text,
				upperCase : false
			});
		},
			
		onSelectionChange : function (oEvent) {
			
			var oList = oEvent.getSource();
			var bSelected = oEvent.getParameter("selected");

			// get the list item, either from the listItem parameter or from the event's source itself (will depend on the device-dependent mode).
			if (!(oList.getMode() === "MultiSelect" && !bSelected)) {
				this._showDetail(oEvent.getParameter("listItem") || oEvent.getSource());
			}
		},
			
		onUpdateFinished : function (oEvent) {
			// update the master list object counter after new data is loaded
			this._updateListItemCount(oEvent.getParameter("total"));
			// hide pull to refresh if necessary
			//this.byId("pullToRefresh").hide();
		},			
			
		_updateListItemCount : function (iTotalItems) {
			var sTitle;
			// only update the counter if the length is final
			if (this._oList.getBinding("items").isLengthFinal()) {
				sTitle = this.getOwnerComponent().getModel("i18n").getResourceBundle().getText("masterTitleCount", [iTotalItems]);
				this.getView().getModel("listHelper").setProperty("/title", sTitle);
			}
		},
			
		_showDetail : function (oItem) {
			this.getOwnerComponent().getRouter().navTo("object", {
				objectId : oItem.getBindingContext().getProperty("ComponentID")
			}, true);
		},
			
		_onBypassed : function () {
			this._oList.removeSelections(true);
		},
			
		_onDocumentationListMatched :  function() {
			this.getOwnerComponent().oListSelector.oWhenListLoadingIsDone.then(
				this._successFunction.bind(this),
				function (mParams) {
					if (mParams.error) {
						return;
					}
					this.getOwnerComponent().getRouter().getTargets().display("detailNoObjectsAvailable");
				}.bind(this)
			);
		},
		
		_successFunction: function (mParams) {
			if (mParams.list.getMode() === "None") {
				return;
			}
			
			var aSorters = [];
			aSorters.push(new Sorter("PackageName", false,
				function(oContext){
				//	var group = oContext.getProperty("GroupName");

					return {
						key: oContext.getProperty("PackageName"),
						text: oContext.getProperty("PackageDescription")
					};
				})
			);
			this._oList.getBinding("items").sort(aSorters);
			
			var sObjectId = mParams.firstListitem.getBindingContext().getProperty("ComponentID");
			this.getOwnerComponent().getRouter().navTo("object", {objectId : sObjectId}, true);
		}
		
	});
});