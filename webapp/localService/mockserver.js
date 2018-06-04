sap.ui.define([
	"sap/ui/core/util/MockServer"
], function(MockServer) {
	"use strict";
	return {
		/**
		 * Initializes the mock server.
		 * You can configure the delay with the URL parameter "serverDelay".
		 * The local mock data in this folder is returned instead of the real data for testing.
		 * @public
		 */
		init: function() {
			// create
			var oMockServer = new MockServer();
			//{
			//	rootUri: "/" //sap/opu/odata/sap/Y_UI5_DOCUMENTATION_SRV/"
			//});
			
//			var rootPath = jQuery.sap.getModulePath("org.at.UI5Documentation");
	
/*			oMockServer.simulate(rootPath + "localService/metadata.xml", {
				sMockdataBaseUrl: rootPath + "localService/XXX",
				bGenerateMissingMockData: false
			});*/
			
			// start
			oMockServer.start();
			jQuery.sap.log.info("MOCK DATA");
		}
	};
});