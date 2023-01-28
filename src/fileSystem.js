$(document).on("click", "#folderLink_Open", async () => {
  await Directory_Handle_Register();
  await mergely_folderLink_Check('left');
  await mergely_folderLink_Check('right');
});

const Directory_Handle_Register = async () => {
  // Indexed Database から FileSystemDirectoryHandle オブジェクトを取得
  // なければディレクトリ選択ダイアログを表示
  linkStatus.handle = await idbKeyval.get('dir');
  if (linkStatus.handle) {
    // すでにユーザーの許可が得られているかをチェック
    let permission = await linkStatus.handle.queryPermission({ mode: 'readwrite' });
    if (permission !== 'granted') {
      // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
      permission = await linkStatus.handle.requestPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        linkStatus.handle = await window.showDirectoryPicker();
        if (!linkStatus.handle) {
          connect_dispNaviBar(false);
          throw new Error('ユーザーの許可が得られませんでした。');
        }
      }
    }
  } else {
    // ディレクトリ選択ダイアログを表示
    linkStatus.handle = await window.showDirectoryPicker();
  }
  connect_dispNaviBar(true);
  linkStatus.ishandle = true;
  // ファイルとディレクトリの一覧
  read_from_handle();
  // FileSystemDirectoryHandle オブジェクトを Indexed Database に保存
  await idbKeyval.set('dir', linkStatus.handle);
  return ('OK');
}

const Directory_Handle_Register_2 = async (name, isNew) => {
  // Indexed Database から FileSystemDirectoryHandle オブジェクトを取得
  if (typeof linkStatus2[name] === 'undefined') {
    linkStatus2[name] = new linkStatusClass;
  }
  linkStatus2[name].handle = await idbKeyval.get(name);
  if (linkStatus2[name].handle) {
    if (isNew) {
      linkStatus2[name].handle = await window.showDirectoryPicker();
    } else {
      // すでにユーザーの許可が得られているかをチェック
      let permission = await linkStatus2[name].handle.queryPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
        permission = await linkStatus2[name].handle.requestPermission({ mode: 'readwrite' });
        if (permission !== 'granted') {
          linkStatus2[name].handle = await window.showDirectoryPicker();
          if (!linkStatus2[name].handle) {
            connect_dispNaviBar(false);
            throw new Error('ユーザーの許可が得られませんでした。');
          }
        }
      }
    }
  } else {
    // ディレクトリ選択ダイアログを表示
    linkStatus2[name].handle = await window.showDirectoryPicker();
  }
  linkStatus2[name].ishandle = true;
  // FileSystemDirectoryHandle オブジェクトを Indexed Database に保存
  await idbKeyval.set(name, linkStatus2[name].handle);
  return ('OK');
}


const read_from_handle = async () => {
  /*
  for await (const handle of linkStatus.handle.values()) {
    if (handle.kind === 'file') {
      if (linkStatus.ishandle) {
        console.log(handle.name);
      }
    } else if (handle.kind === 'directory') {
      console.log(handle.name + '/');
    }
  }*/
  //calendar Load
  if (linkStatus.ishandle && !linkStatus.data.calendar.first_read) {
    let calendar_source = await file_read_json(linkStatus.data.calendar.name, linkStatus.handle);
    EventID = typeof (calendar_source.id) === 'number' ? calendar_source.id : 0;
    window.calendar.addEventSource(calendar_source.event);
    window.calendar.setOption('editable', true);
    worker.postMessage(JSON.stringify(calendar_source.event));
    linkStatus.data.calendar.first_read = true;
  }
}

let linkStatus2 = {};
class linkStatusClass {
  constructor() {
    this.handle = null;
    this.ishandle = false;
  }
}

let linkStatus = {
  handle: null,
  ishandle: false,
  eventChange: false,
  data: {
    sample: {
      name: 'sample.txt',
      islink: false,
      readtype: null,
    }
    ,
    calendar: {
      name: 'calendar.json',
      islink: false,
      readtype: 'file_read_json',
      first_read: false,
    }
  }
}

const file_read_json = async (readTarget, handle) => {
  let file_obj = await handle.getFileHandle(readTarget, { create: true });
  let file = await file_obj.getFile();
  let text = await file.text();
  if (text === '') {
    return [];
  }
  return (JSON.parse(text));
}

const file_read_text = async (readTarget, handle) => {
  let file_obj = await handle.getFileHandle(readTarget, { create: true });
  let file = await file_obj.getFile();
  let text = await file.text();
  if (text === '') {
    return [];
  }
  return (text);
}

const file_save_json = async (writeTarget, data, handle) => {
  if (!linkStatus.ishandle) {
    return null;
  }
  if (data === '') {
    return null;
  }
  await Directory_Handle_Register();
  const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json' });

  let file_obj = await handle.getFileHandle(writeTarget, { create: true });
  const stream = await file_obj.createWritable();
  await stream.write(blob);
  await stream.close();
}

const file_save_text = async (writeTarget, data, handle_name) => {

  if (!linkStatus2[handle_name].ishandle) {
    return null;
  }
  if (data === '') {
    return null;
  }
  const blob = new Blob([data], { type: 'text/plain' });

  let file_obj = await linkStatus2[handle_name].handle.getFileHandle(writeTarget, { create: true });
  const stream = await file_obj.createWritable();
  await stream.write(blob);
  await stream.close();
}

const connect_dispNaviBar = (isConnect) => {
  if (isConnect) {
    let target = $('#folderLink_Message');
    target.html('Linked <span class="material-symbols-outlined">check</span>');
    $('.folderLink_Open_item').css('color', 'green');
  } else {
    let target = $('#folderLink_Message');
    target.html('Failed <span class="material-symbols-outlined">warning</span>');
    target.css('color', 'red');
  }
}
