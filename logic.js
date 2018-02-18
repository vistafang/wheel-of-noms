// Create new wheel object specifying the parameters at creation time.
var realData;
var theWheel;

// Vars used by the code in this page to do power controls.
var wheelPower = 0;
var wheelSpinning = false;

// -------------------------------------------------------
// Function to handle the onClick on the power buttons.
// -------------------------------------------------------
function powerSelected(powerLevel) {
	// Ensure that power can't be changed while wheel is spinning.
	if (wheelSpinning == false) {
		// Reset all to grey incase this is not the first time the user has selected the power.
		
		// Set wheelPower var used when spin button is clicked.
		wheelPower = powerLevel;
	}
}

// -------------------------------------------------------
// Click handler for spin button.
// -------------------------------------------------------
var postspin=false;
function startSpin() {
	if (!theWheel){
		loadWheel();
		postspin=true;
	}
	// Ensure that spinning can't be clicked again while already running.
	if (wheelSpinning == false) {
		// Based on the power level selected adjust the number of spins for the wheel, the more times is has
		// to rotate with the duration of the animation the quicker the wheel spins.
		if (wheelPower == 1) {
			theWheel.animation.spins = 3;
			} else if (wheelPower == 2) {
			theWheel.animation.spins = 6;
			} else if (wheelPower == 3) {
			theWheel.animation.spins = 9;
		}
		
		// Disable the spin button so can't click again while wheel is spinning.
		
		// Begin the spin animation by calling startAnimation on the wheel object.
		theWheel.startAnimation();
		
		// Set to true so that power can't be changed and spin button re-enabled during
		// the current animation. The user will have to reset before spinning again.
		wheelSpinning = true;
	}
}

// -------------------------------------------------------
// Function for reset button.
// -------------------------------------------------------
function resetWheel() {
	theWheel.stopAnimation(false); // Stop the animation, false as param so does not call callback function.
	theWheel.rotationAngle = 0; // Re-set the wheel angle to 0 degrees.
	theWheel.draw(); // Call draw to render changes to the wheel.
	
	wheelSpinning = false; // Reset to false to power buttons and spin can be clicked again.
	//show the actual wheel itself
	
	
	
	$(".outerwheel").show();
	$("#advbtn").show();
	$("#result").hide();
}

// -------------------------------------------------------
// Called when the spin animation has finished by the callback feature of the wheel because I specified callback in the parameters.
// -------------------------------------------------------
function alertPrize(indicatedSegment) {
	// In a real project probably want to do something more interesting than this with the result.
	
	$(".outerwheel").hide();
	$("#advbtn").hide();
	//find winning segment
	for (var i of fullResults){
		if (i.name==indicatedSegment.text){
			var pos={lat:i.geometry.location.lat(),lng:i.geometry.location.lng()};
			map.setCenter(pos);
			marker.setPosition(pos);
			infowindow.setContent("<h2>"+i.name+"</h2> <p>"+i.vicinity+"</p> <a href=https://www.google.com.au/search?q="+i.name+">Open in Google</a>");
			infowindow.open(map, marker);
		}
	}
	
	$("#result").show();
}


var url = "https://maps.googleapis.com/maps/api/place/nearbysearch/json"
var position;

powerSelected(2);

function getRandomColor(){
	var letters="0123456789ABCDEF";
	var p="#";
	for (var i=0;i<6;i++){
		p+=letters[Math.floor(Math.random()*16)];
	}
	return p;
}




var map;
var service;
var marker;
var infowindow;
$(document).ready(start);
function start(){
	var pyrmont = {lat: -33.867, lng: 151.195};
	map = new google.maps.Map(document.getElementById('result_frame'), {
		center: pyrmont,
		zoom: 15,
		scrollwheel: false
	});
	infowindow= new google.maps.InfoWindow({
		content: "<p>Place</p>"
	});
	
	marker = new google.maps.Marker({
		position: pyrmont,
		map: map,
		title: 'Result'
	});
	
	marker.addListener('click', function() {
		infowindow.open(map, marker);
	});
	
	service = new google.maps.places.PlacesService(map);
	var autocomplete = new google.maps.places.Autocomplete($("#lcin")[0]);
	getPosition();
	setsel(1);
	
	autocomplete.setTypes(['geocode']);
	$("#rangeSlide").on("change",loadWheel);
	$("#rangeSlide").on("mousemove",updateRange);
	
	autocomplete.addListener('place_changed', function() {
		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// User entered the name of a Place that was not suggested and
            // pressed the Enter key, or the Place Details request failed.
            window.alert("No details available for input: '" + place.name + "'");
            return;
		}
		p={'lat':place.geometry.location.lat(),"lon":place.geometry.location.lng()};
		loadWheel();
		/*
			infowindowContent.children['place-icon'].src = place.icon;
			infowindowContent.children['place-name'].textContent = place.name;
		infowindowContent.children['place-address'].textContent = address;
		infowindow.open(map, marker);
		*/
	});
}

function thing(fill, loc){
	this.fillStyle=fill;
	this.text=loc;
}
var rqset;
var fullResults;
var searchRange=500;
function loadWheel() {
	var place;
	if (p){
		place = new google.maps.LatLng(p.lat, p.lon);
		}else{
		place = new google.maps.LatLng(-33.8665, 151.1956);
	}
	
	
	// Specify location, radius and place types for your Places API search.
	var request = {
		location: place,
		radius: searchRange,
		types: rqset
	};
	
	// Create the PlaceService and send the request.
	// Handle the callback with an anonymous function.
	
	service.nearbySearch(request, function(results, status) {
		if (status == google.maps.places.PlacesServiceStatus.OK) {
			fullResults=results;
			for (var i = 0; i < results.length; i++) {		
				var segments=[];
				var segct = (results.length>20) ? 20:results.length;
				for (var i=0;i<segct;i++){
					segments.push(new thing(getRandomColor(),results[i].name));
				}
			}
			theWheel=new Winwheel({
				'outerRadius': 212, // Set outer radius so wheel fits inside the background.
				'innerRadius': 65, // Make wheel hollow so segments don't go all way to center.
				'textFontSize': 10, // Set default font size for the segments.
				'textOrientation': 'vertical', // Make text vertial so goes down from the outside of wheel.
				'textAlignment': 'outer', // `	Align text to outside of wheel.
				'numSegments': segct, // Specify number of segments.
				'segments': segments,
				'animation': // Specify the animation to use.
				{
					'type': 'spinToStop',
					'duration': 8, // Duration in seconds.
					'spins': 3, // Default number of complete spins.
					'callbackFinished': alertPrize
				}
			});
			if (postspin){
				startSpin();
				postspin=false;
			}
		}
	});
}

function setsel(set){
	switch (set){
		case 1:
		rqset=['restaurant','bakery','meal_delivery','meal_takeaway','cafe'];
		break;
		case 2:
		rqset=['aquarium','art_gallery','book_store','church','city_hall','electronics_store','embassy','jewelry_store','park'];
		break;
		case 3:
		rqset=['bowling_alley','clothing_store','department_store','movie_theater','museum','spa'];
		break;
	}
	//highlight currently selected set
	$(".setsels").removeClass("selected");
	$(".setsels")[set-1].classList.add("selected");
	loadWheel();
}

var p;
function getPosition(){
	if (navigator.geolocation){
		if (navigator.geolocation.getCurrentPosition(showPosition,failPosition));
		}else{
		failPosition();
	}
}
function showPosition(position) {
	p={'lat':position.coords.latitude,"lon":position.coords.longitude};
	// Specify location, radius and place types for your Places API search.
	var geocoder = new google.maps.Geocoder;
	var latlng = {lat: p.lat, lng: p.lon};
	geocoder.geocode({'location': latlng}, function(results, status) {
		if (status === 'OK') {
			if (results[0]) {
				$("#locbtn")[0].innerHTML=results[0].formatted_address;
				} else {
				$("#locbtn")[0].innerHTML="OK";
			}
			} else {
			$("#locbtn")[0].innerHTML="OK";
		}
	});
	loadWheel();
	//howNext();
}

function failPosition(){
	$("#locbtn")[0].innerHTML="Couldn't retrieve location! Click to retry";	
}

function toggleAdvanced(){
	$('#choicesel').toggle();
	$('.outerwheel').toggle();
	if ($('#advbtn').html() == "Done"){
		$('#advbtn').html("Show advanced options");
		}else{
		$('#advbtn').html("Done")
	}	
}



function updateRange(e){
	var expd=Math.pow(2,e.currentTarget.value);
	//round to 2sf
	var tp = expd/Math.pow(10,Math.round(Math.log10(expd))-1);
	tp=Math.round(tp);
	tp*=Math.pow(10,Math.round(Math.log10(expd))-1);
	
	$("#rangelabel")[0].innerHTML=tp+"m";
	searchRange=tp;
}


$(document).ready(sayHi);
function sayHi(){
	var xhr = new XMLHttpRequest();
	xhr.open("GET",'https://chicksquares.herokuapp.com/noms');
	xhr.send();
}
