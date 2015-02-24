# keyserial.js

keyboard serial command receiver from keyboard device. (i.e. Arduino Micro)

## usage (Web App)

### initialization

```index.html
<script src="keyserial.js"></script>
```

```js
var keySerial = new keyserial({polling:true});
```

### handling numeric data

```js
keySerial.onValue = function(val){
	// anything
};
```

### handling primitive keycode

```js
keySerial.onKey = function(keyCode){
	// anything
};
```

### handling serial charactors

```js
keySerial.onString = function(str){
	// anything
};
```

### device connection

```js
keySerial.onConnect = function(){
	// device connected
};

keySerial.onDisconnect = function(){
	// device disconnected
};
```

## usage (Arduino)

See /samples/device/cdssensor/cdssensor.ino


That's all!
Enjoy! :D


