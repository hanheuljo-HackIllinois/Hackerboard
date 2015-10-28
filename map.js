var map;
var cityCircle;

function drawMap(radius) {
	d3.select("#mapdiv").append("div").attr("id", 'map');
	var UIUC = {lat: 40.114, lng: -88.225};
	map = new google.maps.Map(document.getElementById('map'), {
	    center: UIUC,
	    mapTypeId: google.maps.MapTypeId.ROADMAP
	});

    cityCircle = new google.maps.Circle({
    	strokeColor: '#FF0000',
    	strokeOpacity: 0.8,
    	strokeWeight: 2,
    	fillColor: '#FF0000',
    	fillOpacity: 0.35,
    	map: map,
    	center: UIUC,
    	radius: radius
    });

    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(drawCircle, handleError);
    }

    map.fitBounds(cityCircle.getBounds());
/**
    Colors
    #D76E5D
    #DAA073
    #FFF6C6
    #BBE5F8
    #5C89C3
    #575673
    #322F45
    #1C1B24
*/
    map.set('styles', [
    {
    	featureType: 'water',
    	stylers:[
    		{color: '#5C89C3'}
    	]
    },
    {
        featureType: 'administrative',
        elementType: 'geometry.fill',
        stylers:[
            {color: "DAA073"}
        ]
    },
    {
    	featureType: 'landscape.man_made',
    	elementType: 'geometry',
    	stylers:[
    		{color: "#DAA073"},
            {saturation: "-35"}
    	]
    },
    {
        featureType: 'landscape.natural',
        elementType: 'geometry',
        stylers:[
            {color: "#DAA073"}
        ]
    },
    {
    	featureType: 'landscape.natural.landcover',
    	elementType: 'geometry',
    	stylers:[
    		{color: "#DAA073"}
    	]
    },
    {
        featureType: 'landscape.natural.terrain',
        elementType: 'geometry',
        stylers:[
            {color: "#DAA073"},
            {lightness: "-15"}
        ]
    },
    {
        featureType: 'poi',
        elementType: 'geometry',
        stylers:[
            {color: "DAA073"}
        ]
    },
    {
    	featureType: "road",
    	elementType: "labels",
    	stylers: [
    		{visibility: "off"}
    	]
  	},
    {
        featureType: "road",
        elementType: "geometry",
        stylers:[
            {color: "#FFF6C6"}
        ]
    }
    ]);

/**
    var UIUC_marker = new google.maps.Marker({
        position: UIUC,
        label: "HackIllinois",
        map: map,
        icon: 'logo.png'
    });
*/
}

function handleError(error) {
//    console.log(error);
    //or something else probably
}

function drawCircle(center) {
    console.log(center);
    cityCircle.center = center;
    map.fitBounds(cityCircle.getBounds());
}