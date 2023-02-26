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
let now_menu = 'initialize';
$(document).on('click', '[id^="bnavi-"]', async (e) => {
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    $('#Picture_in_Picture').addClass('displayhide');
    $('#mergely-root').addClass('displayhide');
    $('#toast_editor').addClass('displayhide');
    $('#toast_image').addClass('displayhide');
    now_menu = e.currentTarget.id.substring(6, e.currentTarget.id.length);
    switch (now_menu) {
        case 'home':
            mainArea.html(home_html());
            break;
        case 'folder':
            mainArea.html(await projectBuilder_mainPage());
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
        case 'PiP':
            mainArea.html("");
            $('#Picture_in_Picture').removeClass('displayhide');
            break;
        case 'diff':
            mainArea.html('');
            $('#mergely-root').removeClass('displayhide');
            $('#mergely').mergely('resize');
            break;
        case 'editor':
            mainArea.html('');
            $('#toast_editor').removeClass('displayhide');
            break;
        case 'image':
            mainArea.html('');
            $('#toast_image').removeClass('displayhide');
            break;
        default:
            break;
    }
});

const worker = new Worker('./src/worker.js');

window.onload = async () => {
    disp_notificationPermisson();
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    $('#mergely-root').addClass('displayhide');
    //$('#toast_editor').addClass('displayhide');
    $('#toast_image').addClass('displayhide');
    mergely_render();
    video_start();
    await toast_start();
    await toast_image_start();
    setTimeout(() => { wakelockRequest() }, 3000);
}


worker.addEventListener('message', (e) => {
    console.log(e.data);
    if (CalenderStatus.first_read && CalenderStatus.eventChange) {
        worker.postMessage(JSON.stringify(window.calendar.getEvents()));
        CalenderStatus.eventChange = false;
    }
}, false);

let screenLockToggle = true;

window.addEventListener('resize', async () => {
    if (now_menu === 'image') {
        await toast_image_resizeEvent();
    }
});
$(document).on('click', '#screenLock_Icon', (e) => {
    if (screenLockToggle) {
        wakelockRelease();
    } else {
        wakelockRequest();
    }

});