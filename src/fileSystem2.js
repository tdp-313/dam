const shareCalendarEvent = 'share';
const ShareEvent_bin = "ShareEvent.bin";


const file_read_json = async (readTarget, handle) => {
  let file_obj = await handle.getFileHandle(readTarget, { create: true });
  let file = await file_obj.getFile();
  let text = await file.text();
  if (text === '') {
    return [];
  }
  return (JSON.parse(text));
}

const file_read_text = async (readTarget, handle, isdirectory = true, saveType = 'text',message = false) => {
  let file_obj = handle;
  if (isdirectory) {
    file_obj = await handle.getFileHandle(readTarget, { create: true });
  }
  let file = await file_obj.getFile();
  let lastModifiedTime = await file.lastModified;
  if (message) {
    worker.postMessage({ lastUpdate: lastModifiedTime, target: readTarget, handleName: handle.name });
  }
  if (saveType === 'text') {
    let text = await file.text();
    if (text === '') {
      return [];
    }
    return (text);
  } else if (saveType === 'json') {
    let text = await file.text();
    if (text === '') {
      return [];
    }
    return (JSON.parse(text));
  } else if (saveType === 'bin') {
    let data = await file.arrayBuffer();
    return (new Uint8Array(data));
  }
}

const file_save_json = async (writeTarget, data, handle, handle_name = defaultFileSystemHandleName) => {
  try {
    if (handle_name !== "Worker_Process") {
      if (typeof linkStatus[handle_name] === 'undefined') {
        return null;
      }
      if (!linkStatus[handle_name].ishandle) {
        return null;
      }
      if (data === '') {
        return null;
      }
    }
    const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json' });
    let file_obj = await handle.getFileHandle(writeTarget, { create: true });
    const stream = await file_obj.createWritable();
    await stream.write(blob);
    await stream.close();
  } catch (error) {
    console.error(error, handle_name + '->' + writeTarget);
    window.alert(handle_name + '->' + writeTarget);
  }
}

const file_save_text = async (writeTarget, data, handle, handle_name = defaultFileSystemHandleName, isdirectory = true) => {
  if (writeTarget.indexOf(".") === -1) {
    console.log(writeTarget);
    return null;
  }
  let blobType = "";
  switch (writeTarget.substring(writeTarget.indexOf("."), writeTarget.length)) {
    case ".json":
      blobType = 'application/json';
      data = JSON.stringify(data, null, '  ');
      break;
    case ".txt":
      blobType = "text/plain";
      break;
    case ".bin":
      blobType = "application/octet-stream";
      break;
    case ".md":
      blobType = "text/plain";
      break;
    default:
      console.error('FileSaveTarget Unknown ->' + writeTarget);
      return null;
  }

  try {
    if (handle_name !== "Worker_Process") {
      if (typeof linkStatus[handle_name] === 'undefined') {
        return null;
      }
      if (!linkStatus[handle_name].ishandle) {
        return null;
      }
      if (data === '') {
        return null;
      }
    }
    const blob = new Blob([data], { type: blobType });

    let file_obj = handle;
    if (isdirectory) {
      file_obj = await handle.getFileHandle(writeTarget, { create: true });
    }
    const stream = await file_obj.createWritable();
    await stream.write(blob);
    await stream.close();
    let lastModifiedTime = await (await file_obj.getFile()).lastModified;
    return lastModifiedTime;
  } catch (error) {
    console.error(error, handle_name + '->' + writeTarget);
    window.alert(handle_name + '->' + writeTarget);
    return -1;
  }
}

const isFileUpdateCheck = async (checkTarget, handle, readTime,  isdirectory = true) => {
  let file_obj = handle;
  if (isdirectory) {
    file_obj = await handle.getFileHandle(checkTarget, { create: true });
  }
  let lastModifiedTime = await (await file_obj.getFile()).lastModified;
  if (readTime !== lastModifiedTime) {
    return (true);
  } else {
    return (false);
  }
}
