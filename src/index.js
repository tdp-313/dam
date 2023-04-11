let Sidemenu_Visible = false;
let now_menu = 'initialize';
const worker = new Worker('./src/worker.js');
let screenLockToggle = true;

const settingDir_name = 'setting';
let setting_data = null;

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

$(document).on('click', '[id^="bnavi-"]', async (e) => {
    now_menu = e.currentTarget.id.substring(6, e.currentTarget.id.length);
    setting_data.set_nowView = now_menu;
});

class setting_value {
    constructor(data) {
        console.log();
        if (typeof (data) === 'undefined') {
            this.nowView = "";
        } else {
            this.nowView = typeof (data.nowView) === 'undefined' ? "" : data.nowView;
        }
    }
    get get_nowView() {
        return this.nowView;
    }
    set set_nowView(view) {
        this.nowView = view;
        return this.ViewChange(view);
    }
    async ViewChange(view) {
        //all hide
        let mainArea = $('#renderArea');
        $('#calendarObject').addClass('displayhide');
        $('#Picture_in_Picture').addClass('displayhide');
        $('#mergely-root').addClass('displayhide');
        $('#toast_editor').addClass('displayhide');
        $('#toast_image').addClass('displayhide');

        switch (view) {
            case 'home':
                mainArea.html(await home_html());
                break;
            case 'calendar':
                mainArea.html('');
                $('#calendarObject').removeClass('displayhide');
                window.calendar.changeView('dayGridMonth');
                break;
            case 'monaco':
                mainArea.html('<iframe id="iframe-monaco" title="Moncaco_from DAM" src="./monaco/"></iframe>');
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
            case 'vttCaption':
                mainArea.html(await vtt_main(false));
                break;
            default:
                break;
        }
        worker.postMessage({ visibilitychange: document.visibilityState,nowPage:view });
        await idbKeyval.set(settingDir_name, this);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    calendarStart();
});

window.onload = async () => {
    disp_notificationPermisson();
    let mainArea = $('#renderArea');
    $('#calendarObject').addClass('displayhide');
    $('#mergely-root').addClass('displayhide');
    $('#toast_editor').addClass('displayhide');
    $('#toast_image').addClass('displayhide');
    mergely_render();
    video_start();
    await toast_start();
    await toast_image_start();
    setTimeout(() => { wakelockRequest() }, 3000);
    //

    setting_data = new setting_value(await idbKeyval.get(settingDir_name));
    setting_data.set_nowView = setting_data.get_nowView;
}

worker.addEventListener('message', async (e) => {
    let data = e.data;
    if (data.type === ShareEvent_bin) {
        ymap_GetFile();
    }
    if (data.type === CalenderStatus_Share.name) {
        let calendar_source = await file_read_text(CalenderStatus_Share.name, linkStatus[shareCalendarEvent].handle,true,"json",true);
        console.log("Sync", e.data);
        ReadingShareEventJsonString = JSON.stringify(calendar_source.event);
        if (await window.calendar.getEventSourceById(CalenderStatus_Share.eventID)) {
            await window.calendar.getEventSourceById(CalenderStatus_Share.eventID).remove();
        }
        await window.calendar.addEventSource({ events: calendar_source.event, id: CalenderStatus_Share.eventID });
    }
}, false);

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
