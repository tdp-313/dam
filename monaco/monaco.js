require.config({
  paths: {
    'vs': "./lib/min/vs"
  }, 'vs/nls': {
    availableLanguages: {
      '*': 'ja'
    }
  }
});
let InitModel = null;
const monacoStart = async () => {
  require(["vs/editor/editor.main"], async function () {
    monacoLang();
    monaco.editor.defineTheme('myTheme', await fetchJSON_Read("./theme/dark_1.json"));
    const editorOptionGeneral = {
      language: 'vb',
      mouseWheelZoom: true,
      scrollBeyondLastLine: false,
      locale: 'ja',
      theme: "myTheme",
      definitionLinkOpensInPeek: true,
      stickyScroll: {
        enabled: true,
      },
      readOnly: true,
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
    if (Setting.getInitRead) {
      fileReadStart(false, "init");
    }
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
      extraControlClick(false, "init");
    });
    const modeChangeDiff = document.getElementById('control-EditorModeChange-diff');
    modeChangeDiff.addEventListener('click', (e) => {
      setModeChange('diff');
      diffEditor.layout();
      extraControlClick(true);
    });

    extraControlClick(false, "init");
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

    const readOnlyChange = (isWrite) => {
      if (isWrite) {
        normalEditor.updateOptions({ readOnly: false });
        diffEditor.updateOptions({ readOnly: false });

      } else {
        normalEditor.updateOptions({ readOnly: true });
        diffEditor.updateOptions({ readOnly: true });
      }
      const extraRulerChange = document.getElementById('control-extraReadOnly');
      extraRulerChange.checked = isWrite;
    }

    window.getNormalEditor_Model = async () => {
      return normalEditor.getModel();
    }
    window.getNormalEditor_View = async () => {
      return normalEditor.saveViewState();
    }
    window.setNormalEditor_View = async (view) => {
      normalEditor.restoreViewState(view);
      return null;
    }
    window.getNormalEditor_Model_URI = async (uri_parm) => {
      return monaco.editor.getModel(uri_parm);
    }

    window.setNormalEditor_Model = (model) => {
      normalEditor.setModel(model);
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
    const extraReadOnlyChange = document.getElementById('control-extraReadOnly');
    extraReadOnlyChange.addEventListener('click', (e) => {
      readOnlyChange(e.target.checked);
      console.log(e.target.checked);
    });

    const extraRulerChange = document.getElementById('control-extraRuler');
    extraRulerChange.addEventListener('click', (e) => {
      rulerChange(e.target.checked);
    });

    window.refDefStart = async (model) => {
      let refListFile = null;
      const libFileName = model.uri.path.split('/').filter(str => str !== '');

      if (libFileName.length !== 3) {
        return null;
      }

      let mainRootHandle = linkStatus[monaco_handleName].handle;
      let refRootHandle = linkStatus[monaco_handleName_RefMaster].handle;
      let rootLibName = libFileName[0];
      if (model.getLanguageId() === 'rpg-indent') {
        refListFile = await createRefList(model);
      } else if (model.getLanguageId() === 'dds') {
        if (libFileName[1].indexOf('DDS') !== -1) {
          refListFile = { dds: [{ name: libFileName[2], use: new UseIO_Layout(false) }], dsp: [], pgm: [] };
        } else if (libFileName[1].indexOf('DSP') !== -1) {
          refListFile = { dds: [], dsp: [{ name: libFileName[2], use: new UseIO_Layout(false) }], pgm: [] };
        } else {
          return null;
        }
      } else {
        return null;
      }
      let searchHandleCheck = { normal: false, ref: false }
      if (mainRootHandle !== null) {
        if (model.uri.authority === mainRootHandle.name) {
          searchHandleCheck.normal = true;
        }
      }
      if (refRootHandle !== null) {
        searchHandleCheck.ref = true;
      }

      normalRefDef.clear();
      additionalRefDef.clear();
      notExist_DSP.clear();
      notExist_DDS.clear();
      notExist_PGM.clear();

      let searchLibName = [rootLibName.substring(0, 3)];
      if (Array.isArray(Setting.libraryList[searchLibName])) {
        searchLibName = Setting.libraryList[searchLibName];
      }
      if (searchHandleCheck.normal) {
        let folderHandle = [];
        for await (const handle of mainRootHandle.values()) {
          for (let i = 0; i < searchLibName.length; i++) {
            if (handle.name.indexOf(searchLibName[i]) !== -1) {
              folderHandle.push(handle);
            }
          }
        }
        for (let i = 0; i < folderHandle.length; i++) {
          normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, refListFile.dds, mainRootHandle.name);
          normalRefDef = await refDefCreate(['QDSPSRC'], folderHandle[i], normalRefDef, refListFile.dsp, mainRootHandle.name);
          if (additionalRefDef.size > 0) {//PFILE
            normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, map_valuesArray(additionalRefDef.values()), mainRootHandle.name);
          }
          normalRefDef = await refDefCreate(['QRPGSRC', 'QRPGLESRC', 'QCLSRC'], folderHandle[i], normalRefDef, refListFile.pgm, mainRootHandle.name);
        }
      }

      if (searchHandleCheck.ref) {
        await Directory_Handle_RegisterV2(monaco_handleName_RefMaster, false, 'read');

        let folderHandle = [];
        for await (const handle of refRootHandle.values()) {
          for (let i = 0; i < searchLibName.length; i++) {
            if (handle.name.indexOf(searchLibName[i]) !== -1) {
              folderHandle.push(handle);
            }
          }
        }
        if (folderHandle.length === 0) {
          return null; //end
        }

        if (searchHandleCheck.normal) {
          for (let i = 0; i < folderHandle.length; i++) {
            normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, map_valuesArray(notExist_DDS.values()), refRootHandle.name);
            normalRefDef = await refDefCreate(['QDSPSRC'], folderHandle[i], normalRefDef, map_valuesArray(notExist_DSP.values()), refRootHandle.name);
            if (additionalRefDef.size > 0) {//PFILE
              normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, map_valuesArray(additionalRefDef.values()), refRootHandle.name);
            }
            normalRefDef = await refDefCreate(['QRPGSRC', 'QRPGLESRC', 'QCLSRC'], folderHandle[i], normalRefDef, map_valuesArray(notExist_PGM.values()), refRootHandle.name);
          }
        } else {
          for (let i = 0; i < folderHandle.length; i++) {
            normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, refListFile.dds, mainRootHandle.name);
            normalRefDef = await refDefCreate(['QDSPSRC'], folderHandle[i], normalRefDef, refListFile.dsp, mainRootHandle.name);
            if (additionalRefDef.size > 0) {//PFILE
              normalRefDef = await refDefCreate(['QDDSSRC'], folderHandle[i], normalRefDef, map_valuesArray(additionalRefDef.values()), mainRootHandle.name);
            }
            normalRefDef = await refDefCreate(['QRPGSRC', 'QRPGLESRC', 'QCLSRC'], folderHandle[i], normalRefDef, refListFile.pgm, mainRootHandle.name);
          }
        }
      }
      //original Check
      let originalFile = refListFile.dds.concat(refListFile.dsp);
      for (let i = 0; i < originalFile.length; i++) {
        if (normalRefDef.has(originalFile[i].name)) {
          let temp = normalRefDef.get(originalFile[i].name);
          temp.use.original = true;
          normalRefDef.set(originalFile[i].name, temp);
        }
      }

      if (!firstEditorLoading) {
        loadingPopUpClose();
        firstEditorLoading = true;
      }
      //sidebar
      await createUseFileList(normalRefDef);
    }
    window.sourceRefDefStart = async (refModel, refDef) => {
      refDef.clear();
      var lineCount = await refModel.getLineCount();
      let mode = "";
      for (let i = 1; i <= lineCount; i++) {
        // 行のテキストを取得
        let row = refModel.getLineContent(i);
        if (row.substring(5, 6) === "C" && row.substring(6, 7) !== "*") {
          let op_1 = row.substring(17, 27).trim();
          let op_m = row.substring(45, 50).trim();
          let op_2 = row.substring(50, 60).trim();
          let fieldLen = row.substring(67, 70).trim();
          let result = row.substring(60, 66).trim();

          if (op_1 === "*ENTRY" && op_m === "PLIST") {
            mode = "ENTRY";
          } else if (op_m === "PARM") {
            if (result !== "") {
              refDef.set(result, { location: { range: new monaco.Range(i, 5, i, 77), uri: refModel.uri }, s_description: mode + " PARAMETER", sourceType: "definition", description: result + " : " + mode + " PARAMETER" })
            }
          } else {
            mode = ""
          }
          if (op_m === 'BEGSR') {
            refDef.set(op_2, { location: { range: new monaco.Range(i, 5, i, 77), uri: refModel.uri }, s_description: "SUB ROUTINE", sourceType: "definition", description: op_2 + " : " + "SUB ROUTINE" })
          }
        }
      }
      return refDef;
    }
    const map_valuesArray = (values) => {
      let rtn = [];
      for (let value of values) {
        rtn.push(value); // value1, value2
      }
      return rtn;
    }
    const map_valuesObject = (values) => {
      let rtn = [];
      for (let value of values) {
        rtn.push(value[1]); // value1, value2
      }
      return rtn;
    }
    const refDefCreate = async (FileArray, handle, refDef, reflist, rootHandleName) => {
      let FileName = "";
      let current_SRC = [];
      if (FileArray.length === 1) {
        //DDS,DSPF
        FileName = FileArray[0];
      } else {
        //RPG,RPGLE,CL
        FileName = "PGM";
      }
      for (let i = 0; i < FileArray.length; i++) {
        current_SRC = current_SRC.concat(await createFolderExistList(handle, FileArray[i]));
      }

      for (let i = 0; i < reflist.length; i++) {
        let textData = await getFolderExistList_Text(current_SRC, reflist[i].name);

        if (textData !== null) {
          let uri = monaco.Uri.parse("file://" + rootHandleName + "/" + handle.name + '/' + textData.list.file + '/' + reflist[i].name);
          if (FileName === "PGM") {
            let model = null;
            if (textData.list.file === "QRPGSRC") {
              model = await modelChange(await addIndent(textData.text), 'rpg-indent', uri);
            } else if (textData.list.file === "QCLSRC") {
              model = await modelChange(await addSpaces(textData.text), 'cl', uri);
            } else {
              model = await modelChange(await addSpaces(textData.text), 'rpg', uri);
            }
            refDef.set("'" + reflist[i].name + "'", { location: { range: new monaco.Range(1, 5, await model.getLineCount(), Number.MAX_VALUE), uri: uri }, description: reflist[i].name, s_description: "CALL PGM", sourceType: "PGM", handle: textData.list.handle, use: reflist[i].use });
          } else {
            let model = await modelChange(await addSpaces(textData.text), 'dds', uri);
            refDef = await dds_DefinitionList(model, refDef, reflist[i].name, textData.list.handle, reflist[i].use);
          }
        } else {
          if (FileName === "QDDSSRC") {
            notExist_DDS.set(reflist[i].name, reflist[i]);
          } else if (FileName === "QDSPSRC") {
            notExist_DSP.set(reflist[i].name, reflist[i]);
          } else if (FileName === "PGM") {
            notExist_PGM.set(reflist[i].name, reflist[i]);
          }
        }

      }
      return refDef;
    }
    const extraThemeChange = document.getElementById('control-extraTheme');
    extraThemeChange.addEventListener('click', () => { themeApply((Setting.getTheme) + 1) });
    const themeApply = async (themeState) => {
      switch (themeState) {
        case 1:
          //white
          theme_whiteSetting();
          monaco.editor.defineTheme('myTheme', await fetchJSON_Read("./theme/white.json"));
          break;
        default:
          theme_blackSetting();
          monaco.editor.defineTheme('myTheme', await fetchJSON_Read("./theme/dark_1.json"));
          themeState = 0;
      }
      Setting.setTheme = themeState;
    }
    extraThemeChange.addEventListener('contextmenu', (event) => { themeDiffApply((Setting.getDiffTheme) + 1); event.preventDefault(); });
    const themeDiffApply = (themeState) => {
      switch (themeState) {
        case 1:
          diffEditor.updateOptions({ renderSideBySide: true });
          break;
        default:
          diffEditor.updateOptions({ renderSideBySide: false });
          themeState = 0;
      }
      Setting.setDiffTheme = themeState;
    }
    themeDiffApply(Setting.getDiffTheme);
    themeApply(Setting.getTheme);
    const createRefList = async (refModel) => {
      var lineCount = await refModel.getLineCount();
      let dds = new Map();
      let dsp = new Map();
      let pgm = new Map();
      for (let i = 1; i <= lineCount; i++) {
        // 行のテキストを取得
        let lineText = refModel.getLineContent(i);
        if (lineText.substring(5, 6) === "F" && lineText.substring(6, 7) !== "*") {
          let type = lineText.substring(39, 46).trim();
          let file = lineText.substring(6, 14).trim();
          let use = lineText.substring(14, 15).trim();
          let add = lineText.substring(65, 66).trim();
          let using = new UseIO_Layout(false);
          using.device = type;
          if (add === "A") {
            using.io.add('O');
          }
          if (use === "I") {
            using.io.add('I');
          } else if (use === "U") {
            using.io.add('U');
          } else if (use === "O") {
            using.io.add('O');
          }
          if (type === "WORKSTN") {
            if (dsp.has(file)) {
              using.io = new Set([...using.io, ...dsp.get(file).use.io]);
            }
            dsp.set(file, { name: file, use: using });
          } else if (type === "DISK") {
            if (dds.has(file)) {
              using.io = new Set([...using.io, ...dds.get(file).use.io]);
            }
            dds.set(file, { name: file, use: using });
          } else if (type === "PRINTER") {
            if (dds.has(file)) {
              using.io = new Set([...using.io, ...dds.get(file).use.io]);
            }
            dds.set(file, { name: file, use: using });
          }
        } else if (lineText.substring(5, 6) === "C" && lineText.substring(6, 7) !== "*") {
          let op_m = lineText.substring(45, 50).trim();
          let op_2 = lineText.substring(50, 60).trim();
          let op_2_ex = op_2.replace(/'/g, "");
          if (op_m === "CALL") {
            let using = new UseIO_Layout(false);
            using.device = "PGM";
            using.io = new Set(["-", "-"]);
            pgm.set(op_2_ex, { name: op_2_ex, use: using });
          }
        }
      }

      return { dds: map_valuesObject(dds), dsp: map_valuesObject(dsp), pgm: map_valuesObject(pgm) }
    }

    const reIndentProcess = () => {
      const model = normalEditor.getModel();
      const fullRange = model.getFullModelRange();
      const text = model.getValue();
      const lines = text.split("\n");
      const changeOperation = {
        range: fullRange,
        text: addIndent(revIndent(lines))
      };
      model.pushEditOperations([], [changeOperation], null);
    }

    const spaceInputEnter = async () => {
      var model = await normalEditor.getModel();

      var position = normalEditor.getPosition();

      // テキストを更新する
      var editOperation = {
        range: new monaco.Range(position.lineNumber + 1, 1, position.lineNumber + 1, 1),
        text: " ".repeat(128) + "\n",
      };
      model.pushEditOperations([], [editOperation], null);
      normalEditor.setPosition({
        lineNumber: position.lineNumber + 1,
        column: 6
      });
    }

    normalEditor.onKeyDown(function (e) {
      if (e.code === 'Insert') {
        isInsert = !isInsert;
        insertIconUpdate();
      } else if (e.code === 'Enter') {
        if (extraReadOnlyChange.checked) {
          spaceInputEnter();
          e.stopPropagation();
          e.preventDefault();
          reIndentProcess();
        }
        return null;
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

    normalEditor.addAction({
      id: "rpg_reIndent",
      label: "再インデント処理",
      run: () => { reIndentProcess() }
    });
    let nowork = normalEditor.addCommand(0, () => { }, "");

    monaco.languages.registerCodeLensProvider("rpg-indent", {
      provideCodeLenses: async function (model, token) {
        var lineCount = model.getLineCount();
        let rtn = { lenses: [], dispose: () => { }, };
        for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
          // 行のテキストを取得
          let lineText = model.getLineContent(lineNumber);
          let op_m = lineText.substring(45, 50).trim();
          let op_1 = lineText.substring(17, 27).trim();
          let op_2 = lineText.substring(50, 60).trim();
          if (op_m.indexOf("BEGSR") !== -1) {
            rtn.lenses.push({
              range: {
                startLineNumber: lineNumber,
                startColumn: 45,
                endLineNumber: lineNumber,
                endColumn: 70,
              },
              id: "LINE-" + lineNumber,
              command: {
                id: nowork,
                title: "   subroutine : " + op_1,
              },
            });
          } else if (op_m.indexOf("CALL") !== -1) {
            rtn.lenses.push({
              range: {
                startLineNumber: lineNumber,
                startColumn: 45,
                endLineNumber: lineNumber,
                endColumn: 70,
              },
              id: "LINE-" + lineNumber,
              command: {
                id: nowork,
                title: "   CALL : " + op_2,
              },
            });
          } else if (op_m.indexOf("ENDDO") !== -1) {
            rtn.lenses.push({
              range: {
                startLineNumber: lineNumber + 1,
                startColumn: 45,
                endLineNumber: lineNumber + 1,
                endColumn: 70,
              },
              id: "LINE-" + lineNumber,
              command: {
                id: nowork,
                title: "",
              },
            });
          } else if (op_m.indexOf("ENDSR") !== -1) {
            rtn.lenses.push({
              range: {
                startLineNumber: lineNumber + 1,
                startColumn: 45,
                endLineNumber: lineNumber + 1,
                endColumn: 70,
              },
              id: "LINE-" + lineNumber,
              command: {
                id: nowork,
                title: "",
              },
            });
          } else if (op_m.indexOf("DO") !== -1) {
            rtn.lenses.push({
              range: {
                startLineNumber: lineNumber,
                startColumn: 45,
                endLineNumber: lineNumber,
                endColumn: 70,
              },
              id: "LINE-" + lineNumber,
              command: {
                id: nowork,
                title: "   DO : " + op_2,
              },
            });
          }
        }
        return rtn;
      },
      resolveCodeLens: function (model, codeLens, token) {
        return codeLens;
      },
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
  await rightSidebarRead();
  readFileButtonCreate();
  await tabs_eventStart();
}

const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const loadingPopUpClose = () => {
  const dialog = document.getElementById('loadingPopUp');
  dialog.close();
  dialog.remove();
}

const rightSidebarRead = async () => {
  const r_sidebar_contents = document.getElementById('right-sideBar-contents');
  r_sidebar_contents.addEventListener('click', async (e) => {
    const selectedRadio = document.querySelector('input[name="rs-mode"]:checked');
    if (e.target.id.indexOf("sidebar-filter") !== -1) {
      if (typeof (e.target.checked) !== 'undefined') {
        filterSettingUpdate(e.target.id.substring(15, e.target.id.length), e.target.checked);
      }
      return null;
    }
    if (e.target.id === 'right-sideBar-contents' || selectedRadio.value === "setting") {
      return null;
    }
    let click_node = e.target.parentNode;
    let filename = click_node.getElementsByClassName('sidebar-filename')[0].innerText;
    
    let selectMap = await normalRefDef.get(filename);
    if (typeof (selectMap) === 'undefined') {
      selectMap = await normalRefDef.get("'" + filename + "'");
    }
    if (typeof (selectMap) !== 'undefined') {
      let model = await getNormalEditor_Model_URI(selectMap.location.uri);
      await tabs_add(model, true);
    }
  });

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
    this.theme = typeof (data.theme) === 'undefined' ? 0 : data.theme;
    this.diffTheme = typeof (data.diffTheme) === 'undefined' ? 0 : data.diffTheme;
    this.libraryList = typeof (data.libraryList) === 'undefined' ? {} : data.libraryList;
    this.initRead = typeof (data.initRead) === 'undefined' ? true : data.initRead;
    const initRead_DOM = document.getElementById('control-initRead');
    initRead_DOM.checked = this.initRead;
  }
  get getAll() {
    return this;
  }

  get getTheme() {
    return this.theme;
  }
  get getDiffTheme() {
    return this.diffTheme;
  }
  get getThemeType() {
    if (this.theme === 1) {
      return 'white';
    }
    else {
      return 'black';
    }
  }

  get getInitRead() {
    return this.initRead;
  }
  set setTheme(theme) {
    this.theme = theme;
    this.save();
  }
  set setDiffTheme(theme) {
    this.diffTheme = theme;
    this.save();
  }

  set setLibList(LibList) {
    this.libraryList = LibList;
    this.save();
  }
  set setInitRead(init) {
    this.initRead = init;
    this.save();
  }
  save() {
    idbKeyval.set('monaco-setting', this);
  }
}
var normalRefDef = new Map();
var sourceRefDef = new Map();
var additionalRefDef = new Map();
var notExist_DDS = new Map();
var notExist_DSP = new Map();
var notExist_PGM = new Map();

var linkStatus = {};
let firstEditorLoading = false;
class linkStatusClass {
  constructor() {
    this.handle = null;
    this.ishandle = false;
  }
}
const fetchJSON_Read = async (path) => {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error("HTTP error " + response.status);
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("Fetch error: ", error);
  }
}