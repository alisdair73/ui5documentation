sap.ui.define([
	"sap/ui/core/UIComponent",
	"sap/ui/Device",
	"org/at/UI5Documentation/model/models",
	"org/at/UI5Documentation/controller/ListSelector"
], function(UIComponent, Device, models, ListSelector) {
	"use strict";

	return UIComponent.extend("org.at.UI5Documentation.Component", {

		metadata: {
			manifest: "json"
		},

		init: function() {
			
			this.oListSelector = new ListSelector();
			
			// call the base component's init function
			UIComponent.prototype.init.apply(this, arguments);

			// set the device model
			this.setModel(models.createDeviceModel(), "device");
			
			// create the views based on the url/hash
			this.getRouter().initialize();
		},
		
		destroy : function () {

			this.oListSelector.destroy();

			// call the base component's destroy function
			UIComponent.prototype.destroy.apply(this, arguments);
		},
		
		getContentDensityClass : function() {
			if (this._sContentDensityClass === undefined) {
				// check whether FLP has already set the content density class; do nothing in this case
				if (jQuery(document.body).hasClass("sapUiSizeCozy") || jQuery(document.body).hasClass("sapUiSizeCompact")) {
					this._sContentDensityClass = "";
				} else if (!Device.support.touch) { // apply "compact" mode if touch is not supported
					this._sContentDensityClass = "sapUiSizeCompact";
				} else {
					// "cozy" in case of touch support; default for most sap.m controls, but needed for desktop-first controls like sap.ui.table.Table
					this._sContentDensityClass = "sapUiSizeCozy";
				}
			}
			return this._sContentDensityClass;
		}
		
	});
});