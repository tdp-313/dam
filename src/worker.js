addEventListener('message', (e) => {
    let data = e.data;
    if (typeof (data) === 'string') {
        data = JSON.parse(data);
    }
    read_todayEvents(data);
    //postMessage(e.data);
}, false);

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

today_string = today_date.getFullYear() + '-' + extend_0(today_date.getMonth() +1 ) + '-' + extend_0(today_date.getDate()) + 'T'; 


