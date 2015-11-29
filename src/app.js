/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */
// global alarm variables
var hour = 0;
var minute = 0;
var day = 0;

var UI = require('ui');
var Vector2 = require('vector2');
var Wakeup = require('wakeup');
var Clock = require('clock');
var window = new UI.Window();
var Vibe = require('ui/vibe');
var Accel = require('ui/accel');
var msg = msgMaker("Hello :)");
var alarm = false;

var main = new UI.Card({
  title: 'PebbleLife',
  icon: 'images/menu_icon.png',
  subtitle: 'Welcome to PebbleLife',
  body: 'Press any button to start.'
});

main.show();
Wakeup.launch(function(e) {
  if (alarm){
    msg = msgMaker("Wake up!");
    startAccelCheck();
        vibrateUntilShake();
  }
    console.log("in wakeup launch");
    console.log("alarm is: "+alarm);
    if (e.wakeup) {
        window.add(msg);
              Vibe.vibrate('long');

        window.show();
    }
});

var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'Add Alarm',
        icon: 'images/menu_icon.png',
      }, {
        title: 'Second Item',
      }]
    }]
});

/************************************************
setting alarm text
************************************************/
var weekday;
function dayToWeekday(){
  switch (day){
  case 0:
    weekday = "Sunday";
    break;
  case 1:
    weekday = "Monday";
    break;
  case 2:
    weekday = "Tuesday";
    break;
  case 3:
    weekday = "Wednesday";
    break;
  case 4:
    weekday = "Thursday";
    break;
  case 5:
    weekday = "Friday";
    break;
  case 6:
    weekday = "Saturday";
    break;
  }
}
dayToWeekday();
function changeAlarmText(hour,minute,weekday){
  if (hour === 0){
    hour = "00";
  }
  if (minute === 0){
    minute = "00";
  }
  var alarmText = new UI.Text({
    position: new Vector2(0, 25),
    size: new Vector2(144, 30),
    text: hour + ':' + minute + "\n" + weekday,
    font: 'Gothic-28',
    color: 'black',
    textAlign: 'center'
});
  return alarmText;
}

menu.on('select', function(e) {
    var elements = 5;

  var onHour = true;
  var onMinute = false;
  var onDay = false;
    
    if( e.itemIndex === 0){
      var menuWindow = new UI.Window({
  backgroundColor: 'white'
    });
      var alarmText = changeAlarmText(hour,minute,weekday);
      menuWindow.add(alarmText);
      menuWindow.show();
      
      menuWindow.on('click', 'up', function(e){
        if (onHour){
          hour = hour + 1;
          if (hour >= 25){
            hour = 0;
          }
        } else if (onMinute){
          minute = minute + 1;
          if (minute >= 60){
            minute = 0;
          }
        } else if (onDay){
          day += 1;
          if (day >= 7){
            day = 0;
          }
        }
        dayToWeekday();
        menuWindow.remove(alarmText);
        menuWindow.show();
        
        alarmText = changeAlarmText(hour,minute,weekday);
        
        menuWindow.add(alarmText);
        menuWindow.show();
      });
      
      
      menuWindow.on('click', 'down', function(e){
        if (onHour){
          hour--;
          if (hour <= -1){
            hour = 24;
          }
        } else if (onMinute){
          minute--;
          if (minute <= -1){
            minute = 59;
          }
        } else if (onDay){
          day--;
          if (day <= -1){
            day = 6;
          }
        }
                  dayToWeekday();
        
        menuWindow.remove(alarmText);
        menuWindow.show();
        
        alarmText = changeAlarmText(hour,minute,weekday);
        
        
        menuWindow.add(alarmText);
        menuWindow.show();
      });
      
      menuWindow.on('click', 'select', function(e){
        if (onHour){
          onHour = false;
          onMinute = true;
        } else if (onMinute){
          onMinute = false;
          onDay = true;
        } else if (onDay){
          menuWindow.hide();
          startAlarm();
        }
      });
      
    } else {
      var deleteWindow = new UI.Window({
    backgroundColor: 'white'
    });
    
    var deleteText = changeAlarmText(hour,minute,weekday);
      deleteWindow.add(deleteText);
      deleteWindow.show();
      
      deleteWindow.on('click', 'up', function(e){
        
      e.item.hide();
  
      deleteWindow.hide();
      
      });
    }
    console.log('Selected item #' + e.itemIndex + ' of section #' + e.sectionIndex);
    console.log('The item is titled "' + e.item.title + '"');
});
var shake = false;

function startAlarm(){
  alarm = true;
  var nextTime = Clock.weekday(day,hour,minute);
  console.log("before wakeup function");
  wakeupFunction(nextTime);
}

/**********
main screen logic
************/
main.on('click', 'up', function(e) {
  for (var x = 1; x < 5; x++) {
  menu.item(0, x, { title: 'Alarm ' + x });
}
menu.show();
});

main.on('click', 'select', function(e) {
  for (var x = 1; x < 5; x++) {
  menu.item(0, x, { title: 'Alarm ' + x });
}
menu.show();
});

main.on('click', 'down', function(e) {
  for (var x = 1; x < 5; x++) {
  menu.item(0, x, { title: 'Alarm ' + x });
}
menu.show();
});

// demo
var nextTime1 = Clock.weekday(0, 9,32);

// testing times

var nextTime2 = Clock.weekday(0, 9,23);
var nextTime3 = Clock.weekday(0, 9,24);
var nextTime4 = Clock.weekday(6, 19,14);

function msgMaker(message){
  
  var blah = new UI.Text({
    position: new Vector2(0, 25),
    size: new Vector2(144, 30),
    text: message,
    font: 'Gothic-28',
    color: 'white',
    textAlign: 'center'
  });
  return blah;
}


function wakeupFunction(nextTime){
  console.log("in wakeupfunction");
    Wakeup.schedule({
      time: nextTime,
      }, function(e) {
      if (e.failed) {
        console.log('Wakeup set failed: ' + e.error);
      } else {
        console.log('Wakeup set! Event ID: ' + e.id);
      }
    });
}

function vibrateUntilShake(){
  console.log("in vibrate until shake; shake is "+shake);
    while (!shake){
        Vibe.vibrate('long');
    }
 shake = false;
  alarm = false;
}

var wind = new UI.Window({
        fullscreen: true,
    });

function startAccelCheck(){
  Accel.init();
  Accel.on('data', function(e) {
    console.log('Just received ' + e.samples + ' from the accelerometer.');
              
    for (var i = 0; i < e.samples; i++){
      if (e.accels[i].y > 1200){
        console.log("shake is now true");
        shake = true;
        var textfield = new UI.Text({
          position: new Vector2(0, 65),
          size: new Vector2(144, 30),
          font: 'gothic-24-bold',
          text: 'Alarm off',
          textAlign: 'center'
        });
        wind.add(textfield);
        wind.show();
      }
    }
  });
}

msg = msgMaker("Style on point!");
wakeupFunction(nextTime1);
/*
wakeupFunction(nextTime2,msgMaker("You are amazing :)"));
wakeupFunction(nextTime3,msgMaker("You look great!"));
wakeupFunction(nextTime4,msgMaker("I appreciate you"));*/

