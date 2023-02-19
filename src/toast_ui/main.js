const markdown_idb_backup_name = "preMDE";
const markdown_idb_file_name = 'markdown_file'
const markdown_saveInterval = 3000; //3s
const toast_start = async () => {
  const editor = new Editor({
    el: document.querySelector('#editor'),
    height: 'calc(100vh - 3rem)',
    initialEditType: 'wysiwyg',
    previewStyle: 'vertical',
    usageStatistics: false,
    language: 'ja-JP',
    plugins: [chart, codeSyntaxHighlight, colorSyntax, tableMergedCell, uml],
    theme: 'dark',
    initialValue:'# File is not Linked',
    events: {
      load: () => {
        get_indexedDB_markdown();
        if (!markdown_editor_Status.dom_created) {
          markdown_editor_Status.dom_created = true;
          setInterval(async () => autoSave_Clock_Process(), markdown_saveInterval);
        }
      },
      change: async () => {
        markdown_editor_Status.eventChange = true;
      }
    },
    toolbarItems: [
      ['heading', 'bold', 'italic', 'strike'],
      ['hr', 'quote'],
      ['ul', 'ol', 'task', 'indent', 'outdent'],
      ['table', 'image', 'link'],
      ['code', 'codeblock'],
      // Using Option: Customize the last button
      [{
        el: md_FileOpen_Button(),
        //command: 'bold',
        tooltip: 'ファイルを開く'
      },{
        el: md_autoSave_Button(),
        //command: 'bold',
        tooltip: 'オートセーブ'
      },{
        el: md_FileSaveAs_Button(),
        //command: 'bold',
        tooltip: '保存 / 別名保存'
      }]
    ]
  });

  Editor_root = editor;
}
var Editor_root = null;
const { Editor } = toastui;
const { chart } = Editor.plugin;
const { codeSyntaxHighlight } = Editor.plugin;
const { colorSyntax } = Editor.plugin;
const { tableMergedCell } = Editor.plugin;
const { uml } = Editor.plugin;


const md_FileOpen_Button = () => {
  const button = document.createElement('button');
  button.className = 'toastui-editor-toolbar-icons';
  button.style.backgroundImage = 'none';
  button.style.margin = '0';
  button.innerHTML = `<i><span class="material-symbols-outlined">folder_open</span></i>`;
  button.addEventListener('click', async() => {
    if (await File_Handle_Register(markdown_idb_file_name, true) === 'OK') {
      let handle = linkStatus[markdown_idb_file_name].handle;
      let text = await file_read_text(handle.name, handle, false);
      let idb_data = await idbKeyval.get(markdown_idb_backup_name);
      if (text !== idb_data) {
        if (!window.alert('データを置き換えて反映します。')) {
          //return null;
        }
      }
      Editor_root.setMarkdown(text, true);
      $("#markdown_autosave").css('color', 'green');
    } 
  });
  return button;
}

const md_FileSaveAs_Button = () => {
  const button = document.createElement('button');
  button.className = 'toastui-editor-toolbar-icons';
  button.style.backgroundImage = 'none';
  button.style.margin = '0';
  button.innerHTML = `<i><span class="material-symbols-outlined">save_as</span></i>`;
  button.addEventListener('contextmenu', async (event) => {
    event.oncontextmenu = false;

    if (await Save_Handle_Register(markdown_idb_file_name) === 'OK') {
      let handle = linkStatus[markdown_idb_file_name].handle;
      await file_save_text(handle.name, Editor_root.getMarkdown(), handle, markdown_idb_file_name, false);
      $("#markdown_autosave").css('color', 'green');
    }
  });
  button.addEventListener('click', async (event) => {
    try {
      markdown_editor_Status.eventChange = true;
      let save_info = await autoSave_Clock_Process();
      window.alert('IndexedDB->' + save_info.idb +' File->' + save_info.file);
    }
    catch{
      window.alert("Saveされていません。");
    }
    });
  return button;
}
let md_isAutosave = true;

const md_autoSave_Button = () => {
  const button = document.createElement('button');
  button.className = 'toastui-editor-toolbar-icons';
  button.style.backgroundImage = 'none';
  button.style.margin = '0';
  button.innerHTML = `<i><span id="markdown_autosave" class="material-symbols-outlined" style="color:red">sync</span></i>`;
  button.addEventListener('click', async() => {
    if (md_isAutosave) {
      //sync -> no-sync
      md_autosave_set(false);
      md_isAutosave= false;

    }
    else {
      //no-sync -> sync
      md_autosave_set(true);
      md_isAutosave= true;
    }
  });
  return button;
}
const md_autosave_set = (isAutoSave) =>{
  if (isAutoSave) {
    $("#markdown_autosave").text('sync');
    md_isAutosave= true;
  } else {
    $("#markdown_autosave").text('sync_disabled');
    md_isAutosave= false;
  }
}
const get_indexedDB_markdown = async () => {
  let data = await idbKeyval.get(markdown_idb_backup_name);
  if (typeof (data) === 'undefined') {
    await idbKeyval.set(markdown_idb_backup_name, 'Write Here');
    Editor_root.setMarkdown('', true);
  }
  else {
    Editor_root.setMarkdown(data, true);
  }
}
const set_indexedDB_markdown = async () => {
  let data = Editor_root.getMarkdown();
  //if(data)
  await idbKeyval.set(markdown_idb_backup_name, data);
}

const toast_image_start = async () => {
  const instance = new tui.ImageEditor(document.querySelector('#tui-image-editor'), {
    includeUI: {
      initMenu: 'filter',
      menuBarPosition: 'bottom',
    },
    //cssMaxWidth: 700,
    //cssMaxHeight: 500,
    selectionStyle: {
      cornerSize: 20,
      rotatingPointOffset: 70,
    },
  });
}

const autoSave_Clock_Process = async () => {
  let save_information = { idb: false, file: false };
  if (markdown_editor_Status.eventChange) {
    //save Process
    markdown_editor_Status.eventChange = false;
    await set_indexedDB_markdown();
    save_information.idb = true;
    if (md_isAutosave) {
      if (typeof linkStatus[markdown_idb_file_name] !== 'undefined') {
        if (linkStatus[markdown_idb_file_name].ishandle) {
          let handle = linkStatus[markdown_idb_file_name].handle;
          await file_save_text(handle.name, Editor_root.getMarkdown(), handle, markdown_idb_file_name, false);
          save_information.file = true;
          $("#markdown_autosave").addClass('md_autoSaveAnimation');
          console.debug('markdown_FileSave');
          setTimeout(() => {
            $("#markdown_autosave").removeClass('md_autoSaveAnimation');
          },1000)
        }
      }
    }
  }
  return (save_information);
}