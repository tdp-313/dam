const notification_Dialog = () => {
  Notification.requestPermission(function (permission) {
    switch (permission) {
      case 'granted':
        console.log('リクエストは許可されました。');
        // 通常はここで、デスクトップ通知の表示を行ったりします。
        break;
      case 'denied':
        console.log('リクエストはブロックされました。');
        break;
      default:
        console.log('リクエストのポップアップが閉じられました。');
      // Chrome ではブロック扱いになるようです
    }
    disp_notificationPermisson();
  });
}

$(document).on('click', '#notifications_Icon', () => {
  notification_Dialog();
});

const disp_notificationPermisson = () => {

  let iconArea = $('#notifications_Icon');
  let permission = Notification.permission;
  console.log(permission)
  if (permission === 'granted') {
    iconArea.text('notifications');
    iconArea.css('color', 'green');
  }
  else {
    iconArea.text('notifications_off');
    iconArea.css('color', 'red');
  }
}
///////////////////////////////////////////////////////

const read_todayEvents = (events) => {
  if (events.length === 0) {
    return null;
  }
  today_events = [];
  for (let event of events) {
    if (event.start.indexOf(today_string) !== -1) {
      today_events.push(event);
    }
  }
}
const notification_clock = async() => {
  let calc_now = new Date;
  await read_todayEvents(await window.calendar.getEvents());
  now = calc_now.toTimeString().substring(0, 5);
  let search_time = today_string + now;
  if (today_events.length === 0) {
    return null;
  }

  for (let event of today_events) {
    console.log(event);
    if (event.start.indexOf(search_time) !== -1) {
      spawnNotification(event.extendedProps.description, '', event.title);
    }
  }

  let next = Math.abs(61 - calc_now.getSeconds()) * 1000
  console.log(next, calc_now);
  if (next === 0) {
    next = 1000;
  }
  setTimeout(notification_clock, next);
  //postMessage('Sync Request');
}
function spawnNotification(body, icon, title) {
  const options = {
    body: body,
    icon: icon
  }
  const notification = new Notification(title, options);
}

let today_events = [];
let today_string = '';
let today_date = new Date();

today_string = today_date.getFullYear() + '-' + extend_0(today_date.getMonth() + 1) + '-' + extend_0(today_date.getDate()) + 'T';

const notification_initilize = () => {
  //interval Start 
  let next_time = Math.abs(61 - today_date.getSeconds()) * 1000;
  if (next_time === 0) {
    next_time = 1000;
  }
  console.log(next_time);
  setTimeout(notification_clock, next_time);
}