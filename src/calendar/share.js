async function compareMaps(map1, map2) {
    for (let [key, val] of map1) {
        if (!map2.has(key) || map2.get(key) !== val) {
            return false;
        }
    }
    return true;
}

setInterval(async () => {
    await shareEventSaveStart();
}, 10000);

const shareEventSaveStart = async () => {
    if (CalendarChangeEventQueue.length > 0) {
        let CalendarChangeEventQueueLength = CalendarChangeEventQueue.length;
        let backup_map = new Map();
        y_map.forEach((value, key) => {
            backup_map.set(key, value);
        })
        for (i = 0; i < CalendarChangeEventQueueLength; i++) {
            let CalendarChangeEvent = CalendarChangeEventQueue.shift();
            
            if (CalendarChangeEvent.source !== CalenderStatus_Share.eventID) {
                //skip
            }
            else if (CalendarChangeEvent.type === "add" || CalendarChangeEvent.type === "change") {
                await y_map.set(CalendarChangeEvent.ID, CalendarChangeEvent.eventJson);
                
            } else if (CalendarChangeEvent.type === "remove") {
                await y_map.delete(CalendarChangeEvent.ID, CalendarChangeEvent.eventJson);
            }
        }
        if (await compareMaps(backup_map, y_map)) {
            return;
        }
        //save
        console.log("SAVE");
        try {
            await ymap_saveFile();
        }
        catch {
            await ymap_ForceSaveFile();
        }
    }
}

const ymap_saveFile = async () => {
    await ydocDiffSave(ShareEvent_bin, calendar_ydoc, linkStatus[shareCalendarEvent].handle, shareCalendarEvent);
    await ymap_applyCalendar();
}

const ymap_ForceSaveFile = async () => {
    await ydocForceSave(ShareEvent_bin, calendar_ydoc, linkStatus[shareCalendarEvent].handle, shareCalendarEvent);
}
const ymap_GetFile = async () => {
    window.calendar_ydoc = await recreateYdoc(calendar_ydoc);
    y_map = await window.calendar_ydoc.getMap(CalenderStatus_Share.EventID);

    calendar_ydoc = await window.ydocGet(ShareEvent_bin, linkStatus[shareCalendarEvent].handle,calendar_ydoc , true);
    await ymap_applyCalendar();
}

const ymap_applyCalendar = async () => {
    let event = await ymap_ToEventArray(calendar_ydoc.getMap(CalenderStatus_Share.EventID));

    if (await window.calendar.getEventSourceById(CalenderStatus_Share.eventID)) {
        await window.calendar.getEventSourceById(CalenderStatus_Share.eventID).remove();
    }
    await window.calendar.addEventSource({ events: event, id: CalenderStatus_Share.eventID });
}
const ymap_ToEventArray = async (ymap) => {
    let eventArray = [];
    ymap.forEach((value, key) => {
        eventArray.push(JSON.parse(value));
    })
    return eventArray;
}