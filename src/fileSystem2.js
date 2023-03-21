const file_read_json = async (readTarget, handle) => {
    let file_obj = await handle.getFileHandle(readTarget, { create: true });
    let file = await file_obj.getFile();
    let text = await file.text();
    if (text === '') {
      return [];
    }
    return (JSON.parse(text));
  }
  
  const file_read_text = async (readTarget, handle, isdirectory = true,saveType = 'text') => {
    let file_obj = handle;
    if (isdirectory) {
      file_obj = await handle.getFileHandle(readTarget, { create: true });
    }
    let file = await file_obj.getFile();
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
    } else if(saveType === 'bin'){
      await file.text();
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
    try {
      if (!linkStatus[handle_name].ishandle) {
        return null;
      }
      if (data === '') {
        return null;
      }
      const blob = new Blob([data], { type: 'text/plain' });
  
      let file_obj = handle;
      if (isdirectory) {
        file_obj = await handle.getFileHandle(writeTarget, { create: true });
      }
      const stream = await file_obj.createWritable();
      await stream.write(blob);
      await stream.close();
    } catch (error) {
      console.error(error, handle_name + '->' + writeTarget);
      window.alert(handle_name + '->' + writeTarget);
    }
  }