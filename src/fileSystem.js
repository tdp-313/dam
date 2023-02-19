const defaultFileSystemHandleName = 'dir';
$(document).on("click", "#folderLink_Open", async () => {
  await Directory_Handle_Register(defaultFileSystemHandleName);
  //await mergely_folderLink_Check('left');
  //await mergely_folderLink_Check('right');
});

const Directory_Handle_Register = async (name = defaultFileSystemHandleName, isNew = false) => {
  // Indexed Database から FileSystemDirectoryHandle オブジェクトを取得
  if (typeof linkStatus[name] === 'undefined') {
    linkStatus[name] = new linkStatusClass;
  }
  linkStatus[name].handle = await idbKeyval.get(name);
  if (linkStatus[name].handle) {
    if (isNew) {
      linkStatus[name].handle = await window.showDirectoryPicker();
    } else {
      // すでにユーザーの許可が得られているかをチェック
      let permission = await linkStatus[name].handle.queryPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
        permission = await linkStatus[name].handle.requestPermission({ mode: 'readwrite' });
        if (permission !== 'granted') {
          linkStatus[name].handle = await window.showDirectoryPicker();
          if (!linkStatus[name].handle) {
            connect_dispNaviBar(false);
            throw new Error('ユーザーの許可が得られませんでした。');
          }
        }
      }
    }
  } else {
    // ディレクトリ選択ダイアログを表示
    linkStatus[name].handle = await window.showDirectoryPicker();
  }
  linkStatus[name].ishandle = true;
  // FileSystemDirectoryHandle オブジェクトを Indexed Database に保存
  await idbKeyval.set(name, linkStatus[name].handle);
  if (name === defaultFileSystemHandleName) {
    await default_from_handle(name);
  }
  connect_dispNaviBar(true);
  return ('OK');
}

const File_Handle_Register = async (name ,isNew = false) =>{
  const pickerOpts = {
    types: [
      {
        description: 'markdown',
        accept: {
          'md/*': ['.md'],
        },
      },
    ],
    excludeAcceptAllOption: true,
    multiple: false,
  };

  if (typeof linkStatus[name] === 'undefined') {
    linkStatus[name] = new linkStatusClass;
  }
  linkStatus[name].handle = await idbKeyval.get(name);
  if (linkStatus[name].handle) {
    if (isNew) {
      linkStatus[name].handle = await window.showOpenFilePicker(pickerOpts)
    } else {
      // すでにユーザーの許可が得られているかをチェック
      let permission = await linkStatus[name].handle.queryPermission({ mode: 'readwrite' });
      if (permission !== 'granted') {
        // ユーザーの許可が得られていないなら、許可を得る（ダイアログを出す）
        permission = await linkStatus[name].handle.requestPermission({ mode: 'readwrite' });
        if (permission !== 'granted') {
          linkStatus[name].handle = await window.showOpenFilePicker(pickerOpts)
          if (!linkStatus[name].handle) {
            throw new Error('ユーザーの許可が得られませんでした。');
          }
        }
      }
    }
  } else {
    // File選択ダイアログを表示
    linkStatus[name].handle = await window.showOpenFilePicker(pickerOpts);
  }
  linkStatus[name].handle = linkStatus[name].handle[0];
  linkStatus[name].ishandle = true;
  await idbKeyval.set(name, linkStatus[name].handle);
  return ('OK');
}

const Save_Handle_Register = async (name ) =>{
  const opt = {
    types: [
      {
        description: 'markdown',
        accept: {
          'md/*': ['.md'],
        },
      },
    ],
  };

  if (typeof linkStatus[name] === 'undefined') {
    linkStatus[name] = new linkStatusClass;
  }
  let new_handle = await window.showSaveFilePicker(opt);
  console.log(new_handle);
  linkStatus[name].handle = new_handle
  linkStatus[name].ishandle = true;
  await idbKeyval.set(name, linkStatus[name].handle);
  return ('OK');
}

const default_from_handle = async (name) => {
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
  if (!linkStatus[name].ishandle) {
    return null;
  }
  if (/*!diff_Directory.first_read*/true) {
    diff_Directory.handle = await linkStatus[name].handle.getDirectoryHandle(diff_Directory.name, {create: true});
    diff_Directory.first_read = true;
    diff_Directory.dir = {};
    diff_Directory.dir_array = [];
    for await (const handle of diff_Directory.handle.values()) {
      if (handle.kind === 'file') {
        //console.log('skip',handle.name);
      } else if (handle.kind === 'directory') {
        diff_Directory.dir[handle.name] = { handle: await diff_Directory.handle.getDirectoryHandle(handle.name) };
        diff_Directory.dir_array.push(handle.name);
      }
    }
    if (diff_Directory.dir_array.length === 0) {
      //dir not found 
    }
    else {
      let right_folder = $('#mergely_toolbar_right_folder');
      let left_folder = $('#mergely_toolbar_left_folder');
      right_folder.html('');
      left_folder.html('');
      for (let i = 0; i < diff_Directory.dir_array.length; i++){
        right_folder.append('<option value="' + diff_Directory.dir_array[i] + '">' + diff_Directory.dir_array[i] + '</option>');
        left_folder.append('<option value="' + diff_Directory.dir_array[i] + '">' + diff_Directory.dir_array[i] + '</option>');
      }
      if (diff_Directory.dir_array.length > 0) {
        await mergely_folderLink_pulldownCreate($("#mergely_toolbar_left_folder").val(), 'left');
        await mergely_folderLink_pulldownCreate($("#mergely_toolbar_right_folder").val(), 'right');
        await mergely_text_set_main('left', $('#mergely_toolbar_left_file').val(), diff_Directory.dir[$('#mergely_toolbar_left_folder').val()].handle);
      }
    }
  }
  //markdown 
  if (!markdown_editor_Status.first_read) {
    markdown_editor_Status.handle = await linkStatus[name].handle.getDirectoryHandle(markdown_editor_Status.name, { create: true });
    markdown_editor_Status.resource_handle = await markdown_editor_Status.handle.getDirectoryHandle(markdown_editor_Status.resource_name, { create: true });
    markdown_editor_Status.export_handle = await markdown_editor_Status.handle.getDirectoryHandle(markdown_editor_Status.export_name, { create: true });
    let last_backup = await file_read_json(markdown_editor_Status.backup, markdown_editor_Status.handle);
    markdown_editor_Status.first_read = true;
    if (last_backup.length === 0) {
      //Create Backup File
      let backup = new markdown_backup();
      await file_save_json(markdown_editor_Status.backup,backup,markdown_editor_Status.handle,defaultFileSystemHandleName)
    } else {
      //Read Backup File
      console.log(last_backup);
      if (last_backup.data === '') {
        //no data
        console.log(last_backup);
      }
    }
  }

  //calendar Load
  if (!CalenderStatus.first_read) {
    let calendar_source = await file_read_json(CalenderStatus.name, linkStatus[name].handle);
    EventID = typeof (calendar_source.id) === 'number' ? calendar_source.id : 0;
    window.calendar.addEventSource(calendar_source.event);
    window.calendar.setOption('editable', true);
    worker.postMessage(JSON.stringify(calendar_source.event));
    CalenderStatus.first_read = true;
  }

}

let linkStatus = {};
class linkStatusClass {
  constructor() {
    this.handle = null;
    this.ishandle = false;
  }
}

let diff_Directory = {
  handle: null,
  name: 'diff',
  first_read: false,
  dir: {},
  dir_array: [],
}

let CalenderStatus = {
  name: 'calendar.json',
  readtype: 'file_read_json',
  first_read: false,
  eventChange: false,
}

let markdown_editor_Status = {
  handle : null,
  name: 'markdown',
  backup:'backup.json',
  first_read: false,
  dom_created:false,
  eventChange: false,
  resource_handle: null,
  resource_name : 'resource',
  export_handle: null,
  export_name : 'export',
}
class markdown_backup {
  constructor() {
    this.last_filename = '';
    this.data = '';
    this.lastsaved = '';
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

const file_read_text = async (readTarget, handle,isdirectory = true) => {
  let file_obj = handle;
  if(isdirectory){
    file_obj = await handle.getFileHandle(readTarget, { create: true });
  }
  let file = await file_obj.getFile();
  let text = await file.text();
  if (text === '') {
    return [];
  }
  return (text);
}

const file_save_json = async (writeTarget, data, handle, handle_name = defaultFileSystemHandleName) => {
  try {
    if (typeof linkStatus[handle_name] === 'undefined') {
      return null;
    }
    if (!linkStatus[handle_name].ishandle) {
      return null;
    }
    if (data === '') {
      return null;
    }
    const blob = new Blob([JSON.stringify(data, null, '  ')], { type: 'application/json' });
  
    let file_obj = await handle.getFileHandle(writeTarget, { create: true });
    const stream = await file_obj.createWritable();
    await stream.write(blob);
    await stream.close();
  } catch (error){
    console.error(error, handle_name + '->' + writeTarget);
    window.alert(handle_name + '->' + writeTarget);
  }

}

const file_save_text = async (writeTarget, data, handle, handle_name = defaultFileSystemHandleName,isdirectory = true) => {
  try {
    if (!linkStatus[handle_name].ishandle) {
      return null;
    }
    if (data === '') {
      return null;
    }
    const blob = new Blob([data], { type: 'text/plain' });
    
    let file_obj = handle;
    if(isdirectory){
      file_obj = await handle.getFileHandle(writeTarget, { create: true });
    } 
    const stream = await file_obj.createWritable();
    await stream.write(blob);
    await stream.close();
  } catch (error){
    console.error(error, handle_name + '->' + writeTarget);
    window.alert(handle_name + '->' + writeTarget);
  }
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
