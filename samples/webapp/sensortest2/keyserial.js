// [keyserial.js]
// keyboard serial command receiver
//
// CCA3.0 License 2015 by D.F.Mac.
// See also http://creativecommons.org/licenses/by/3.0/

var keyserial = function(param){
  this.isActive = false;    // true: handling key | false:thru key
  this.isConnect = false;   // true: connecting | false: disconnecting
  this.mode = 0;            // 0:keycode | 1:number | 2:str 
  this.isWDT = false;       // true: WDT on | false: WDT off
  if(param){
    if((param.polling == true)||(param.polling == false)){
      this.isWDT = param.polling;    
    }
  }
  this.WDEXPIRE = 4;        // 1000 * 4 ms
  this.wdcount = this.WDEXPIRE;
  this.str = "";
  this.value = 0;

  ////////// interfaces

  // start handling key
  this.start = function(){
    console.log("keyserial.start");
    this.isActive = true;
    if(this.isWDT == false){
      this.onConnect();
      this.isConnect = true;
    }
  }.bind(this);

  // stop handling key
  this.stop = function(){
    console.log("keyserial.stop");
    this.isActive = false;
    if(this.isWDT == false){
      this.onDisconnect();
      this.isConnect = false;
    }
  }.bind(this);

  ////////// Event Handler
 
  // Connection state change : connect
  this.onConnect = function(){
    console.log("keyserial.onConnect");
  }.bind(this);

  // Connection state change : disconnect
  this.onDisconnect = function(){
    console.log("keyserial.onDisconnect");
  }.bind(this);

  // key event handler
  this.onKey = function(keyCode){
    console.log("keyserial.onKey:"+keyCode);
  }.bind(this);

  // number handler (0-99999)
  this.onNumber = function(value){
    console.log("keyserial.onValue:"+value);
  }.bind(this);

  // string handler
  this.onString = function(str){
    console.log("keyserial.onString:"+str);
  }.bind(this);

  ////////// Internal Functions

  // hander:number
  this.handleNumber = function(keyCode){
    if(keyCode == 13){
      this.onValue(this.value);
      this.mode = 0;
    }else{
      if((keyCode >= 48) && (keyCode <= 57)){
        var val = keyCode - 48;
        this.value = (this.value * 10)+val;
        if(this.value >= 99999){ // 本当は65565にしたいけど面倒w
          console.log("keyserial.handleNumber:error-001");
          this.mode = 0;
        }
      }else{
        console.log("keyserial.handleNumber:error-002");
        this.mode = 0;
      }
    }
  }.bind(this);

  // hander:str
  this.handleStr = function(keyCode){
    if(keyCode == 13){
      this.onString(this.str);
      this.mode = 0;
    }else{
      this.str = this.str+String.fromCharCode(keyCode);
    }
  }.bind(this);

  // Watch Dog Timer 
  window.setInterval(function(){
    if(this.isWDT == true){
      if(this.wdcount > 0){
        this.wdcount --;
        if(this.wdcount == 0){
          this.onDisconnect();
          this.isConnect = false;
        }
      }
    }
  }.bind(this),1000);

  // KeyEvent dispatcher
    // 'Enter':13 : mode=0 : key oneshot mode
    // ',':188    : mode=1 : number mode ('0':48 - '9':57)
    // '.':190    : mode=2 : strings mode
    
  document.onkeydown = function(ev){
    if(this.isActive == true){
      // polling
      if(ev.keyCode == 13){
        this.wdcount = this.WDEXPIRE;
        if(this.isConnect == false){
          this.onConnect();          
        }
        this.isConnect = true;
      }
      // handle key
      if(this.mode == 0){
        if(ev.keyCode == 190){        // ',' comma
          this.str = "";
          this.mode = 2; // str
        }else if(ev.keyCode == 188){  // '.' period
          this.value = 0;
          this.mode = 1; // number
        }else{
          this.onKey(ev.keyCode);
        }
      }else if(this.mode == 1){
        this.handleNumber(ev.keyCode);
      }else if(this.mode == 2){
        this.handleStr(ev.keyCode);
      }
    }
  }.bind(this);

};
