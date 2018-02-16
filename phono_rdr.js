$(document).ready(checkphone);
function checkphone(){
	if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerHeight>window.innerWidth){
		if (!window.location.href.includes("phone"))window.location="phone.html"
	}else{
		if (!window.location.href.includes("index"))window.location="index.html"
	}
}

