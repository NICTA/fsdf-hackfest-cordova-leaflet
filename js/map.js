/*
 * Copyright National ICT Australia Limited (NICTA) 2013.
 */

function MapCtrl($scope) {

	// Our WMS Servers
	$scope.servers = [ {
		name : "Admin Bounds",
		url : "http://geospace.research.nicta.com.au:8080/admin_bnds/ows"
	}, {
		name : "Geotopo 250k",
		url : "http://geospace.research.nicta.com.au:8080/geotopo_250k/ows"
	} ];

	// Storage for layers info
	$scope.layers = [];

	// Request capabilities from the geoserver
	$scope.requestLayers = function() {
		var queryUrl = "?request=GetCapabilities&service=WMS";

		var requestSuccess = function(data) {
			var json = $.xml2json(data);
			$scope.layers = json.Capability.Layer.Layer;
			console.log("received " + $scope.layers.length + " layers");
			$scope.$apply();
		};

		var requestError = function(jqXHR, textStatus, errorThrown) {
			alert("ERROR: " + textStatus + " : " + errorThrown);
		};

		$.ajax({
			url : $scope.serverUrl + queryUrl,
			success : requestSuccess,
			error : requestError
		});
	};

	// Set up the base Leaflet map
	$scope.initMap = function() {
		var map = L.map('map');
		var osmUrl = 'http://tile.openstreetmap.org/{z}/{x}/{y}.png';

		L.tileLayer(osmUrl, {
			attribution : 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
			maxZoom : 18
		}).addTo(map);

		function onLocationFound(e) {
			var radius = e.accuracy / 2;
			L.marker(e.latlng).addTo(map);
			L.circle(e.latlng, radius).addTo(map);
		}

		map.on('locationfound', onLocationFound);

		function onLocationError(e) {
			// Location not found, fit to Australia
			map.fitBounds([ [ -10, 153 ], [ -43, 113 ] ]);
		}

		map.on('locationerror', onLocationError);

		map.locate({
			setView : true,
			maxZoom : 12
		});

		$scope.map = map;
	};

	// Set up a WMS layer
	$scope.setLayer = function(layerName) {
		console.log("Setting layer to: " + layerName);

		// Remove any previous layer
		if (typeof $scope.layer !== 'undefined') {
			$scope.map.removeLayer($scope.layer);
		}

		// Create the new layer
		var newLayer = L.tileLayer.wms($scope.serverUrl, {
			layers : layerName,
			format : 'image/png',
			transparent : true,
			opacity : 0.75,
			attribution : "NICTA"
		});

		$scope.map.addLayer(newLayer);
		$scope.layer = newLayer;

		// Highlight in the UI
		for ( var i = 0; i < $scope.layers.length; ++i) {
			$scope.layers[i].css = $scope.layers[i].Name === layerName ? 'active' : '';
		}
	};

	$scope.setServer = function(serverUrl) {
		$scope.serverUrl = serverUrl;

		console.log("Setting server to: " + serverUrl);
		console.log(JSON.stringify($scope.servers));
		$scope.requestLayers(serverUrl);

		// Highlight in the UI
		for ( var i = 0; i < $scope.servers.length; ++i) {
			$scope.servers[i].css = $scope.servers[i].url === serverUrl ? 'active' : '';
		}
	};

	$scope.init = function() {
		$scope.setServer($scope.servers[0].url);
		// $scope.requestLayers();
		$scope.initMap();
	};

	// Call init at an appropriate time
	if (navigator.userAgent.match(/(iPhone|iPod|iPad|Android|BlackBerry|IEMobile)/)) {
		document.addEventListener("deviceready", $scope.init, false);
		console.log('initialising map on device');
	} else {
		// Allow local testing in a browser
		$scope.init();
		console.log('initialising map in browser');
	}

}