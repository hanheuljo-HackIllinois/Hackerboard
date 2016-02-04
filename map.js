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
    #D76E5D     R: 215 G: 110 B:  93 * scale
    #DAA073     R: 218 G: 160 B: 115 * scale
    #FFF6C6     R: 255 G: 246 B: 198
    #BBE5F8     R: 187 G: 229 B: 248
    #5C89C3     R:  92 G: 137 B: 195 * scale
    #575673     R:  87 G:  86 B: 115 * scale
    #322F45     R:  50 G:  47 B:  69 * scale
    #1C1B24     R:  28 G:  27 B:  36
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