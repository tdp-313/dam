$(document).on('click', '#hamberger', (e) => {
    if (Sidemenu_Visible) {
        //close
        $('#naviArea').addClass('naviArea_Visible');
        $('.navi-button').addClass('border-color');
        $('#mainArea').addClass('mainArea_to_naviArea_Visible');
        Sidemenu_Visible = false;
        document.getElementById('mainArea').addEventListener('transitionend', () => {
            window.calendar.updateSize();
          });
    } else {
        //open
        $('#naviArea').removeClass('naviArea_Visible');
        $('.navi-button').removeClass('border-color');
        $('#mainArea').removeClass('mainArea_to_naviArea_Visible');
        Sidemenu_Visible = true;
        document.getElementById('mainArea').addEventListener('transitionend', () => {
            window.calendar.updateSize();
          });
    }
});
let Sidemenu_Visible = false;
$(document).on('click', '[id^="bnavi-"]', async (e) => {
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    switch (e.currentTarget.id.substring(6,e.currentTarget.id.length)) {
        case 'home':
            mainArea.html(home_html());
            break;
        case 'folder':
            mainArea.html(await specBuilder_mainPage());
            break;
        case 'calendar':
            mainArea.html('');
            $('#calendarObject').removeClass('displayhide');
            window.calendar.changeView('dayGridMonth');
            break;
        case 'task':
            mainArea.html('<div id="myKanban"></div>')
            Kanban_Start();
            break;
        case 'calendar_history':
            mainArea.html('<div id="calendar_history"></div>');
            calendar_history_start();
            break;
        default:
            break;
    }

    

    /*
    let container = mainArea.clone();
    container.html('');
    container.html = filesystem_html;
    cpnsole.log()
    mainArea.replaceWith(container);*/
});

//const worker = new Worker('./src/worker.js');

window.onload = () => {
    disp_notificationPermisson();
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    notification_initilize();
    //mainArea.html(home_html());
}
/*
worker.addEventListener('message', (e) => {
    console.log(e.data);
    if (linkStatus.data.calendar.first_read && linkStatus.eventChange) {
        //worker.postMessage(JSON.stringify(window.calendar.getEvents()));
        read_todayEvents(window.calendar.getEvents());
        linkStatus.eventChange = false;
    }
  }, false);
*/