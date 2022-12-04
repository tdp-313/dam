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
    $('#Picture_in_Picture').addClass('displayhide');
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
            mainArea.html(await kanban_html());
            await Kanban_Start();
            break;
        case 'calendar_history':
            mainArea.html('<div id="calendar_history"></div>');
            await calendar_history_start();
            break;
        case 'PiP':
            mainArea.html("");
            $('#Picture_in_Picture').removeClass('displayhide');
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

const worker = new Worker('./src/worker.js');

window.onload = () => {
    disp_notificationPermisson();
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    //mainArea.html(home_html());
    video_start();
}


worker.addEventListener('message', (e) => {
    console.log(e.data);
    if (linkStatus.data.calendar.first_read && linkStatus.eventChange) {
        worker.postMessage(JSON.stringify(window.calendar.getEvents()));
        linkStatus.eventChange = false;
    }
}, false);
let screenLockToggle = false;
$(document).on('click', '#screenLock_Icon', (e) => { 
    if (screenLockToggle) {
        wakelockRelease();   
    } else {
        wakelockRequest();
    }
    if (screenLockToggle) {
        $('#screenLock_Icon').css('color', 'red');
    } else {
        $('#screenLock_Icon').css('color', 'green');
    }
});