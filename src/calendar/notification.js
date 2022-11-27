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