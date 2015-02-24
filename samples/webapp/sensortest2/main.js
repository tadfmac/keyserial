var value = 0;
var key = 0;

var keySerial = new keyserial({polling:true});

keySerial.onValue = function(val){
	$("#sensorvalue").text(val);
};

keySerial.onKey = function(keyCode){
	key = keyCode;
	if(key == 76){
		$("#img_brightness").removeClass("sts_none").removeClass("sts_dark").addClass("sts_light");
	}else if(key == 68){
    	$("#img_brightness").removeClass("sts_none").removeClass("sts_light").addClass("sts_dark");
	}
}

keySerial.onConnect = function(){
	$("#sensorvalue").text(value);
	if(key == 76){
		$("#img_brightness").removeClass("sts_none").removeClass("sts_dark").addClass("sts_light");
	}else if(key == 68){
    	$("#img_brightness").removeClass("sts_none").removeClass("sts_light").addClass("sts_dark");
	}
};

keySerial.onDisconnect = function(){
	$("#sensorvalue").text("---");
    $("#img_brightness").removeClass("sts_light").removeClass("sts_dark").addClass("sts_none");
};

keySerial.start();

