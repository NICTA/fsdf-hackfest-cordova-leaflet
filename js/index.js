/*
 * Copyright National ICT Australia Limited (NICTA) 2013.
 */

var app = {
	// Application Constructor
	initialize : function() {
		this.bindEvents();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents : function() {
		// document.addEventListener('deviceready', this.onDeviceReady, false);

		if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
			document.addEventListener("deviceready", this.onDeviceReady, false);
			console.log('running on device');
		} else {
			// Allow local testing in a browser
			this.onDeviceReady();
			console.log('running on browser');
		}
	},

	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicity call 'app.receivedEvent(...);'
	onDeviceReady : function() {
		app.receivedEvent('deviceready');
	},

	// Update DOM on a Received Event
	receivedEvent : function(id) {
		console.log('Received Event: ' + id);
	}
};
