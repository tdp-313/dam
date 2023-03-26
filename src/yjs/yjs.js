import * as Y from 'https://cdn.jsdelivr.net/npm/yjs@13.5.50/+esm';

window.calendar_ydoc = new Y.Doc();

window.ydocForceSave = async (writeTarget, ydoc, handle, handle_name = shareCalendarEvent) => {
    if (typeof linkStatus[handle_name] === 'undefined' || writeTarget.indexOf(".") === -1) {
        return null;
    }
    const state1 = Y.encodeStateAsUpdateV2(ydoc);
    await file_save_text(writeTarget, state1, handle, shareCalendarEvent, true);
}

window.ydocDiffSave = async (writeTarget, ydoc, handle, handle_name = shareCalendarEvent) => {
    if (typeof linkStatus[handle_name] === 'undefined' || writeTarget.indexOf(".") === -1) {
        return null;
    }
    
    let saveFile_Ydoc = new Y.Doc();
    saveFile_Ydoc = await ydocGet(writeTarget, handle, saveFile_Ydoc);

    let currentState1 = Y.encodeStateAsUpdateV2(ydoc)
    let currentState2 = Y.encodeStateAsUpdateV2(saveFile_Ydoc)
    const stateVector1 = Y.encodeStateVectorFromUpdateV2(currentState1);
    const stateVector2 = Y.encodeStateVectorFromUpdateV2(currentState2);
    const diff1 = Y.diffUpdateV2(currentState1, stateVector2);
    const diff2 = Y.diffUpdateV2(currentState2, stateVector1);
    currentState1 = Y.mergeUpdatesV2([currentState1, diff2])
    currentState1 = Y.mergeUpdatesV2([currentState1, diff1])
    //Y.applyUpdateV2(saveFile_Ydoc, currentState1);

    const synced = Y.encodeStateAsUpdateV2(ydoc);
    Y.applyUpdateV2(ydoc, synced);
    worker.postMessage({ CalendarHandleName: handle.name, data: { target: writeTarget, json: synced } });
    //await file_save_text(writeTarget, synced, handle, shareCalendarEvent, true);
}

window.ydocGet = async (readTarget, handle, ydoc, isdirectory = true) => {
    let filedata = await file_read_text(readTarget, handle, true, "bin",true);
    Y.applyUpdateV2(ydoc, filedata);
    return ydoc;
}

window.recreateYdoc = async (old_ydoc) => {
    old_ydoc.destroy();
    let new_ydoc = new Y.Doc();
    return new_ydoc;
}