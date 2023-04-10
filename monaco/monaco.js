require.config({
  paths: {
    'vs': "./lib/min/vs"
  }, 'vs/nls': {
    availableLanguages: {
      '*': 'ja'
    }
  }
});

const monacoStart = async () => {

  require(["vs/editor/editor.main"], async function () {
    monacoLang();

    monaco.editor.defineTheme('myTheme', theme_dark);
    const editorOptionGeneral = {
      language: 'vb',
      mouseWheelZoom: true,
      scrollBeyondLastLine: false,
      locale: 'ja',
      theme: "myTheme",
      stickyScroll: {
        enabled: true,
      },
    };

    var normalEditor = monaco.editor.create(document.getElementById('monaco-code'), {
      automaticLayout: true,
    });
    normalEditor.updateOptions(editorOptionGeneral);
    var diffEditor = monaco.editor.createDiffEditor(document.getElementById('monaco-diff'), {
      renderSideBySide: true,
      enableSplitViewResizing: false,
      autoSurround: 'brackets',
      automaticLayout: true,
    });
    diffEditor.updateOptions(editorOptionGeneral);
    var diff = {};
    diff.left = monaco.editor.createModel('function hello() {\n\talert("Hello world!");\n}', 'javascript');
    diff.right = monaco.editor.createModel('function hello() {\n\tconsole.log("Hello world!");\n}', 'javascript');

    diffEditor.setModel({
      original: diff.left,
      modified: diff.right
    });

    document.getElementById('monaco-code').style.display = 'block';
    document.getElementById('monaco-diff').style.display = 'none';

    const modeChangeCode = document.getElementById('control-EditorModeChange-code');
    modeChangeCode.addEventListener('click', (e) => {
      setModeChange('code');
      normalEditor.layout();
      extraControlClick(false);
    });
    const modeChangeDiff = document.getElementById('control-EditorModeChange-diff');
    modeChangeDiff.addEventListener('click', (e) => {
      setModeChange('diff');
      diffEditor.layout();
      extraControlClick(true);
    });
    let isInsert = true;
    const insertChange = document.getElementById('control-extraInsertText');
    insertChange.addEventListener('click', (e) => {
      isInsert = e.target.checked;
      insertIconUpdate();
    });
    const insertIconUpdate = () => {
      if (isInsert) {
        normalEditor.updateOptions({ cursorStyle: "line-thin" });
      } else {
        normalEditor.updateOptions({ cursorStyle: "block" });
      }
      insertChange.checked = isInsert;
    }
    const rulerChange = (isDisp) => {
      if (isDisp) {
        normalEditor.updateOptions({ rulers: [5, 6, 17, 27, 45, 50, 60, 66, 69, 71, 77] });
        diffEditor.updateOptions({ rulers: [5, 6, 17, 27, 32, 42, 48, 51, 53, 59] });
      } else {
        normalEditor.updateOptions({ rulers: [] });
        diffEditor.updateOptions({ rulers: [] });
      }
      const extraRulerChange = document.getElementById('control-extraRuler');
      extraRulerChange.checked = isDisp;
    }

    window.monacoRead2 = async (editModel, diffModel_original, diffModel_modified) => {
      const rpgEditorOption = () => {
        return ({
          columnSelection: true,
          emptySelectionClipboard: true,
          automaticLayout: true,
          bracketMatching: "always",
          //foldingStrategy: "indentation",
          folding: true,
        });
      }
      //let editLang = editModel.getLanguageId();
      //let diff_originalLang = diffModel_original.getLanguageId();
      //let diff_modifiedLang = diffModel_modified.getLanguageId();
      
      //Title
      document.title = editModel.uri.path;
      //normalEditor 
      normalEditor.setModel(editModel);
      //diffEditor
      diffEditor.setModel({
        original: diffModel_original,
        modified: diffModel_modified,
      });
      ruler_State = true;
      rulerChange(ruler_State);
      //anytime
      normalEditor.updateOptions(rpgEditorOption());
      diffEditor.updateOptions(rpgEditorOption());
    }

    const extraRulerChange = document.getElementById('control-extraRuler');
    extraRulerChange.addEventListener('click', (e) => {
      rulerChange(e.target.checked);
    });

    const extraTerminal = document.getElementById('control-extraTerminal');
    extraTerminal.addEventListener('click', async (e) => {
      //monaco.editor.showCommands();
      await refDefStart();
      const model = await normalEditor.getModel();
      console.log(await createUML(model));
    });

    window.refDefStart = async () => {
      const model = await normalEditor.getModel();
      let refListFile = null;
      console.log(model.getLanguageId);
      if (model.getLanguageId() === 'rpg-indent') {
        refListFile = await createRefList(model);
      } else if (model.getLanguageId() === 'dds') {
        const leftFolder = document.getElementById('control-Folder-Left');
        const leftFile = document.getElementById('control-File-Left');
        if (leftFolder.value === 'QDDSSRC') {
          refListFile = { dds: [FileList.Left.File[leftFile.value].name], dsp: [] };
        } else if (leftFolder.value === 'QDSPSRC') {
          refListFile = { dds: [], dsp: [FileList.Left.File[leftFile.value].name] };
        } else {
          return null;
        }
      } else {
        return null;
      }
      const LibLeft = document.getElementById('control-Library-Left');
      
      if (LibLeft.value === '') {
        return null;
      }
      normalRefDef.clear();
      additionalRefDef.clear();
      notExist_DSP.clear();
      notExist_DDS.clear();
      normalRefDef = await refDefCreate('QDDSSRC', FileList.Left.Library[LibLeft.value].handle, normalRefDef, refListFile.dds);
      normalRefDef = await refDefCreate('QDSPSRC', FileList.Left.Library[LibLeft.value].handle, normalRefDef, refListFile.dsp);
      if (additionalRefDef.size > 0) {//PFILE
        normalRefDef = await refDefCreate('QDDSSRC', FileList.Left.Library[LibLeft.value].handle, normalRefDef, [...additionalRefDef]);
      }
      if (Setting.getRefMaster) {
        await Directory_Handle_RegisterV2(monaco_handleName_RefMaster, false, 'read');
        let refRootHandle = linkStatus[monaco_handleName_RefMaster].handle;
        let searchLibName = LibLeft.value.substring(0, 3);
        let folderHandle = null;
        for await (const handle of refRootHandle.values()) {
          if (handle.name.indexOf(searchLibName) !== -1) {
            folderHandle = handle;
            break;
          }
        }
        if (folderHandle === null) {
          return null; //end
        }
        additionalRefDef.clear();
        normalRefDef = await refDefCreate('QDDSSRC', folderHandle, normalRefDef, [...notExist_DDS]);
        normalRefDef = await refDefCreate('QDSPSRC', folderHandle, normalRefDef, [...notExist_DSP]);
        if (additionalRefDef.size > 0) {//PFILE
          normalRefDef = await refDefCreate('QDDSSRC', folderHandle, normalRefDef, [...additionalRefDef]);
        }
      }
    }

    const refDefCreate = async (FileName, handle, refDef, reflist) => {
      let current_SRC = await createFolderExistList(handle, FileName);

      for (let i = 0; i < reflist.length; i++) {
        let uri = monaco.Uri.parse(handle.name + '/' + FileName + '/' + reflist[i]);
        let textData = await getFolderExistList_Text(current_SRC, reflist[i]);
        if (textData !== null) {
          let model = await modelChange(textData, 'dds', uri);
          refDef = await dds_DefinitionList(model, refDef, reflist[i]);
        } else {
          if (FileName === "QDDSSRC") {
            notExist_DDS.add(reflist[i]);
          } else if (FileName === "QDSPSRC") {
            notExist_DSP.add(reflist[i]);
          }
        }
      }
      return refDef;
    }
    const extraThemeChange = document.getElementById('control-extraTheme');
    extraThemeChange.addEventListener('click', () => themeApply((Setting.getTheme) + 1));
    const themeApply = (themeState) => {
      switch (themeState) {
        case 0:
          monaco.editor.defineTheme('myTheme', theme_dark2);
          break;
        case 1:
          monaco.editor.defineTheme('myTheme', theme_dark3);
          break;
        case 2:
          monaco.editor.defineTheme('myTheme', theme_white);
          break;
        default:
          monaco.editor.defineTheme('myTheme', theme_dark);
          themeState = 0;
      }
      Setting.setTheme = themeState;
    }
    themeApply(Setting.getTheme);
    const createRefList = async (refModel) => {
      var lineCount = await refModel.getLineCount();
      let dds = [];
      let dsp = [];
      for (let i = 1; i <= lineCount; i++) {
        // 行のテキストを取得
        let lineText = refModel.getLineContent(i);
        if (lineText.substring(5, 6) === "F" && lineText.substring(6, 7) !== "*") {
          let type = lineText.substring(39, 46).trim();
          let file = lineText.substring(6, 14).trim();
          if (type === "WORKSTN") {
            dsp.push(file);
          } else if (type === "DISK") {
            dds.push(file);
          }
        }
      }
      return { dds: dds, dsp: dsp }
    }

    normalEditor.onKeyDown(function (e) {
      if (e.code === 'Insert') {
        isInsert = !isInsert;
        insertIconUpdate();
      }
      if (isInsert === true) {
        return null;
      }
      // Overwriteしたいテキストを取得する
      if (e.browserEvent.key.length !== 1 || e.altKey || e.ctrlKey || e.metaKey || e.shiftKey) {
        //e.preventDefault();
        return;
      }
      let overwriteText = e.browserEvent.key;
      console.log(overwriteText);
      // カーソル位置を取得する
      var position = normalEditor.getPosition();
      var model = normalEditor.getModel();

      // テキストを更新する
      var editOperation = {
        range: new monaco.Range(position.lineNumber, position.column, position.lineNumber, position.column + 1),
        text: overwriteText
      };
      model.pushEditOperations([], [editOperation], null);

      // カーソル位置を更新する
      normalEditor.setPosition({
        lineNumber: position.lineNumber,
        column: position.column + 1
      });

      // デフォルトの動作をキャンセルする
      e.preventDefault();
    });
  });
}
const modelChange = async (text, lang, uri) => {
  let model = monaco.editor.getModel(uri);
  if (model) {
    model.setValue(text);
  } else {
    model = monaco.editor.createModel(text, lang, uri);
  }
  return model;
}
window.onload = async () => {
  await SettingLoad();
  await monacoStart();
  await readFileButtonCreate();
  //setting Load
}

const SettingLoad = async () => {
  let loadData = await idbKeyval.get('monaco-setting');
  if (loadData) {
    Setting = new localSetting(loadData);
  } else {
    Setting = new localSetting({});
  }
}
var Setting = null;
const setModeChange = (mode) => {
  if (mode === 'code') {
    document.getElementById('monaco-code').style.display = 'block';
    document.getElementById('monaco-diff').style.display = 'none';
  } else {
    document.getElementById('monaco-code').style.display = 'none';
    document.getElementById('monaco-diff').style.display = 'block';
  }
}

class localSetting {
  constructor(data) {
    this.handleSeparate = typeof (data.handleSeparate) === 'undefined' ? false : data.handleSeparate;
    this.theme = typeof (data.theme) === 'undefined' ? 0 : data.theme;
    this.refMaster = typeof (data.refMaster) === 'undefined' ? false : data.refMaster;
  }
  get getAll() {
    return this;
  }
  get getHandleSeparate() {
    return this.handleSeparate;
  }
  get getTheme() {
    return this.theme;
  }
  get getRefMaster() {
    return this.refMaster;
  }
  set setHandleSeparate(handle_sepa) {
    this.handleSeparate = handle_sepa;
    this.save();
  }
  set setTheme(theme) {
    this.theme = theme;
    this.save();
  }
  set setRefMaster(isMaster) {
    this.refMaster = isMaster;
    this.save();
  }
  save() {
    idbKeyval.set('monaco-setting', this);
  }
}
var normalRefDef = new Map();
var additionalRefDef = new Set();
var notExist_DDS = new Set();
var notExist_DSP = new Set();
var linkStatus = {};
class linkStatusClass {
  constructor() {
    this.handle = null;
    this.ishandle = false;
  }
}