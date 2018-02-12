$(document).ready(checkphone);
function checkphone(){
	if (window.outerHeight>window.outerWidth){
		if (!window.location.href.includes("phone"))window.location="phone.html"
	}else{
		if (!window.location.href.includes("index"))window.location="index.html"
	}
}

