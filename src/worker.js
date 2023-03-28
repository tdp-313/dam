importScripts('./fileSystem2.js');

addEventListener('message', (e) => {
    let data = e.data;
    if (typeof (data) === 'string') {
        data = JSON.parse(data);
    }
    //read_todayEvents(data);
    //postMessage(e.data);
    //console.log(data);
    let dataObjectKey = Object.keys(data);
    if (dataObjectKey.indexOf("handle") !== -1) {
        backup_handle[data.handle.name] = { handle: data.handle, data: { target: "", json: "none" }, lastUpdate: "" };
    }
    else if (dataObjectKey.indexOf("CalendarHandleName") !== -1) {
        if (typeof (backup_handle[data.CalendarHandleName]) !== 'undefined') {
            if (data.data.target.indexOf(".bin") !== -1) {
                console.log(data.data.json);
                backup_handle[data.CalendarHandleName].data = data.data;
            } else if (data.data.target.indexOf(".json") !== -1) {
                backup_handle[data.CalendarHandleName].data.target = data.data.target;
                backup_handle[data.CalendarHandleName].data.json = JSON.parse(data.data.json);
            }
        }
    }
    else if (dataObjectKey.indexOf("lastUpdate") !== -1) {
        if (typeof (backup_handle[data.handleName]) !== 'undefined') {
            backup_handle[data.handleName].lastUpdate = data.lastUpdate;
        }
    }
    else if (dataObjectKey.indexOf("visibilitychange") !== -1) {
        if (data.nowPage !== "") {
            nowPage = data.nowPage;
        }
        if (nowPage === "calendar" && data.visibilitychange === "visible") {
            clearTimeout(interval);
            clockSpeed = 5000;
            clockProcess();
        } else {
            clockSpeed = 60000 * 30;
        }
    }

}, false);
//SaveClock
let clockSpeed = 5000;
let backup_handle = {};
let nowPage = "";
const clockProcess = async () => {
    let backup_handleKey = Object.keys(backup_handle);
    let shareSkip = false;
    for (let i = 0; i < backup_handleKey.length; i++) {
        if (backup_handle[backup_handleKey[i]].data.json !== "none") {
            //save
            let handle_data = backup_handle[backup_handleKey[i]];
            backup_handle[backup_handleKey[i]].lastUpdate = await file_save_text(handle_data.data.target, handle_data.data.json, handle_data.handle, "Worker_Process");
            console.log('Save', backup_handleKey[i], handle_data);
            backup_handle[backup_handleKey[i]].data.json = "none";
            if (handle_data.data.target === ShareEvent_bin) {
                shareSkip = true;
            }
        }
        if (!shareSkip) {
            if (backup_handleKey[i] === shareCalendarEvent) {
                if (isShareEvent_FIle) {
                    if (await isFileUpdateCheck('calendarShare.json', backup_handle[backup_handleKey[i]].handle, backup_handle[backup_handleKey[i]].lastUpdate)) {
                        self.postMessage({ type: 'calendarShare.json', data: "UpdateRequired" });
                    }
                }
                else {
                    if (await isFileUpdateCheck(ShareEvent_bin, backup_handle[backup_handleKey[i]].handle, backup_handle[backup_handleKey[i]].lastUpdate)) {
                        self.postMessage({ type: ShareEvent_bin, data: "UpdateRequired" });
                    }
                }
            }

        }

    }
    /*
    let calc_now = new Date;

    let next = Math.abs(61 - calc_now.getSeconds()) * 1000
    console.log(next, calc_now);
    if (next === 0) {
        next = 1000;
    } else if (next > 10000) {

    }*/
    console.log(clockSpeed);
    interval = setTimeout(async () => { clockProcess() }, clockSpeed);
}

let interval = setTimeout(async () => { clockProcess() }, 5000);
//Notification (Not Working)
const extend_0 = (text) => {
    if (String(text).length === 1) {
        text = '0' + text;
    }
    return (text);
}
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
const notification_clock = () => {
    let calc_now = new Date;
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
    postMessage('Sync Request');
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


