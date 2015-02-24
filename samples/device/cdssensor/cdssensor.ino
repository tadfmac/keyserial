#include <Serial.h>
#define BUTTON 3
#define CDS 3
#define LED 5

boolean nowstate = false;
int button = LOW;
int cnt = 10;
boolean isPolling = false;
boolean isSendBoolWaiting = false;

void setup() {
  pinMode(BUTTON, INPUT);
  pinMode(LED, OUTPUT);
  Keyboard.begin();
//  Serial.begin(19200);
}

void loop() {
  boolean state = false;
  int cdsvalue = analogRead(CDS);  
  cdsvalue >>= 5;
  if (cdsvalue < 16) {
    state = false;
  }else{
    state = true;
  }
  if(nowstate != state){
    sendBool(state);
    cnt = 10;
    sendValue(cdsvalue);
    Serial.println(cdsvalue);
  }
  nowstate = state; 
  
  //  Polling on/off
  int nowbutton = digitalRead(BUTTON);
  if((nowbutton == HIGH)&&(nowbutton != button)){
    isPolling ^= 0x01;
    if(isPolling == true){
      isSendBoolWaiting = true;
      digitalWrite(LED,HIGH);
    }else{
      isSendBoolWaiting = false;
      digitalWrite(LED,LOW);
    }
  }
  button = nowbutton;
  if(isPolling){
    cnt --;
    if(cnt == 0){
      cnt = 10;
      Keyboard.write(KEY_RETURN);
      if(isSendBoolWaiting == true){
        sendBool(state);
        sendValue(cdsvalue);
        isSendBoolWaiting = false;
      }
    }
  }

  delay(100);
}

void sendBool(boolean state){
  if(state == true){
    Keyboard.write('d');
  }else{
    Keyboard.write('l');
  }
}

void sendValue(int value){
  int cnt;
  int digits[5] = {0,0,0,0,0};
  int tmp;
  int digit;
  
  digits[0] = value / 10000;
  tmp = value % 10000;
  digits[1] = tmp / 1000;
  tmp = tmp % 1000;
  digits[2] = tmp / 100;
  tmp = tmp % 100;
  digits[3] = tmp / 10;
  tmp = tmp % 10;
  digits[4] = tmp;
  
  Keyboard.write(',');

  for(cnt=0;cnt<5;cnt++){
    digit = digits[cnt];
    if((digit!=0)||(cnt==4)){
      Keyboard.write(digit+48);
    }
  }
  
  Keyboard.write(KEY_RETURN);
  
}
