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
    // 通常のエディターを作成
    //monaco.editor.setLocale('ja');
    monaco.languages.register({ id: 'rpg' });
    monaco.languages.register({ id: 'rpg-indent' });
    monaco.languages.setLanguageConfiguration('rpg-indent', {
      indentSize: 2,
      useTabStops: false,
      brackets: [
        ['{', '}'],
      ],
    });
    monaco.languages.setMonarchTokensProvider('rpg', rpg_token());
    monaco.languages.setMonarchTokensProvider('rpg-indent', rpg_token2());
    monaco.editor.defineTheme('myTheme', theme_dark);
    //monaco.editor.telemetry = false;
    const flag_regex = /\*IN[0-9][0-9]/;
    monaco.languages.registerDefinitionProvider('rpg-indent', {
      provideDefinition: function (model, position) {
        let row = model.getLineContent(position.lineNumber);
        let text = getRow_Text(row, position.column);
        const wordStr = text.text.trim();
        if (wordStr === "") {
          return null;
        }
        let ranges = [];

        let lineCount = model.getLineCount();
        for (let i = 1; i < lineCount; i++) {
          let row = model.getLineContent(i);
          let op_1 = row.substring(17, 27).trim();
          let op_m = row.substring(45, 50).trim();
          let op_2 = row.substring(50, 60).trim();
          let fieldLen = row.substring(67, 70).trim();
          let result = row.substring(60, 66).trim();
          if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "C") {
            if (op_m === 'PARM') {
              if (wordStr === result) {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              }
            } else if (op_m === 'PLIST' || op_m === 'KLIST' || op_m === 'BEGSR') {
              if (wordStr === op_1) {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              }
            } else {
              if (wordStr === result && fieldLen !== '') {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              } else if (wordStr === result && wordStr.substring(0, 1) === "*") {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              }
            }
            if (text.type === 'flag' || text.type === 'flag1' || text.type === 'flag2' || text.type === 'flag3') {
              let wordStr_flag = "*IN" + wordStr;
              if (wordStr_flag === result) {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              }
            }
            if (flag_regex.test(wordStr)) {
              let flag = [];
              flag.push(row.substring(71, 73));
              flag.push(row.substring(73, 75));
              flag.push(row.substring(75, 77));
              if (flag.includes(wordStr.substring(3, 5))) {
                ranges.push({ range: new monaco.Range(i, 5, i, 77), uri: model.uri });
              }
            }
          }
        }
        return ranges;
      }
    });
    monaco.languages.registerReferenceProvider('rpg-indent', {
      provideReferences: function (model, position) {
        let row = model.getLineContent(position.lineNumber);
        let text = getRow_Text(row, position.column);
        const wordStr = text.text.trim();
        if (wordStr === "") {
          return null;
        }
        let ranges = [];

        let lineCount = model.getLineCount();
        for (let i = 1; i < lineCount; i++) {
          let row = model.getLineContent(i);
          if (row.substring(6, 7) !== "*" && row.substring(5, 6) === "C") {
            let op_1 = row.substring(17, 27).trim();
            //let op_m = row.substring(45, 50).trim();
            let op_2 = row.substring(50, 60).trim();
            //let fieldLen = row.substring(67, 70).trim();
            let result = row.substring(60, 66).trim();

            if (wordStr === op_1 || wordStr === op_2 || wordStr === result) {
              ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr) + 1, i, row.lastIndexOf(wordStr) + wordStr.length + 1), uri: model.uri });
            }
            if (text.type === 'flag' || text.type === 'flag1' || text.type === 'flag2' || text.type === 'flag3') {
              let wordStr_flag = "*IN" + wordStr;
              if (wordStr_flag === op_1 || wordStr_flag === op_2) {
                ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr_flag) + 1, i, row.lastIndexOf(wordStr_flag) + wordStr_flag.length + 1), uri: model.uri });
              }
            }
            if (flag_regex.test(wordStr)) {
              let flag = [];
              flag.push(row.substring(9, 11));
              flag.push(row.substring(12, 14));
              flag.push(row.substring(15, 17));
              flag.push(row.substring(71, 73));
              flag.push(row.substring(73, 75));
              flag.push(row.substring(75, 77));
              if (flag.includes(wordStr.substring(3, 5))) {
                ranges.push({ range: new monaco.Range(i, row.indexOf(wordStr.substring(3, 5)) + 1, i, row.lastIndexOf(wordStr.substring(3, 5)) + 3), uri: model.uri });
              }
            }
          }
        }
        return ranges;
      }
    });
    monaco.languages.registerHoverProvider('rpg-indent', {
      provideHover: function (model, position) {
        // 変数名の取得
        let word = model.getWordAtPosition(position);
        if (!word) {
          return null;
        };
        let row = model.getLineContent(position.lineNumber);
        let text = getRow_Text(row, position.column)
        const wordStr = text.text.trim();
        if (wordStr.length === 0) {
          return null;
        }

        let tooltip_text = ["", "", ""];
        let target = 'tip_' + text.type;
        if (window[target].type === "fixed") {
          tooltip_text[0] = '**' + wordStr + '**';
          tooltip_text[1] = window[target].description;
        } else if (window[target].type === "simpleDetail") {
          let tip = window[target].detail[text.text];
          if (typeof (tip) === "undefined") {
            tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
            tooltip_text[1] = window[target].description
          } else {
            tooltip_text[0] = '**' + tip.name + " : " + wordStr + '**';
            tooltip_text[1] = tip.description;
            if (typeof (tip.description2) !== 'undefined') {
              tooltip_text[2] = tip.description2;
            }
          }
        } else if (window[target].type === "Detail_2") {
          let tip = window[target].detail[text.text];
          tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
          tooltip_text[1] = tip.description;
        } else if (window[target].type === "substr") {
          let tip = window[target].detail[text.text.substring(0, window[target].len)];
          tooltip_text[0] = '**' + window[target].name + " : " + wordStr + '**';
          tooltip_text[1] = tip.description;
        }
        // ホバー情報の作成
        return {
          range: new monaco.Range(position.lineNumber, text.startColumn, position.lineNumber, text.endColumn),
          contents: [
            { value: tooltip_text[0] },
            { value: tooltip_text[1] },
            { value: tooltip_text[2] }
          ]
        };
      }
    });
    monaco.languages.registerFoldingRangeProvider('rpg-indent', {
      provideFoldingRanges: function (model, context, token) {
        //console.log(model, context, token, "test");
        // 折りたたむ範囲を格納する配列
        var ranges = [];

        // 行数を取得
        var lineCount = model.getLineCount();

        for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
          // 行のテキストを取得
          let lineText = model.getLineContent(lineNumber);
          // 折りたたみ範囲の開始行を判定
          let plus = lineText.substring(27, 45).indexOf("{");
          if (plus !== -1 && lineText.substring(5, 7) === "C ") {
            // 折りたたみ範囲が開始された
            let startLineNumber = -1;
            let endLineNumber = -1;
            startLineNumber = lineNumber;
            for (let endLineRow = startLineNumber + 1; endLineRow <= lineCount; endLineRow++) {
              let endlineText = model.getLineContent(endLineRow);
              if (endlineText.substring(5, 7) === "C ") {
                if (endlineText.substring(27, 45).substr(plus, 1) === "}") {
                  // 折りたたみ範囲が終了した
                  endLineNumber = endLineRow - 1;

                  // 折りたたみ範囲を配列に追加
                  if (startLineNumber !== -1 && endLineNumber !== -1) {
                    ranges.push({
                      start: startLineNumber,
                      end: endLineNumber
                    });
                  }
                  break;
                }
              }
            }
          }
        }
        // 折りたたみ範囲を返す
        return ranges;
      }
    })
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
    // 差分エディターを作成
    var diffEditor = monaco.editor.createDiffEditor(document.getElementById('monaco-diff'), {
      renderSideBySide: true,
      enableSplitViewResizing: false,
      autoSurround: 'brackets',
      automaticLayout: true,
    });
    diffEditor.updateOptions(editorOptionGeneral);
    // 差分を表示する元となるテキストを作成
    var diff = {};

    diff.left = monaco.editor.createModel('function hello() {\n\talert("Hello world!");\n}', 'javascript');
    diff.right = monaco.editor.createModel('function hello() {\n\tconsole.log("Hello world!");\n}', 'javascript');

    // 差分を表示する元となるエディターを設定
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
    window.monacoRead = async (text, lang, text2 = "", readFileName = "") => {
      ruler_State = true;
      if (text2.length === 0) {
        normalEditor.setValue(text);
        const model = normalEditor.getModel();
        monaco.editor.setModelLanguage(model, lang)
        nowLang = lang;
        document.title = readFileName;
      }
      else {
        diff.left = await monaco.editor.createModel(text, lang);
        diff.right = await monaco.editor.createModel(text2, lang);
        diffEditor.setModel({
          original: diff.left,
          modified: diff.right,
        });
      }
      rulerChange(true);
      normalEditor.updateOptions(rpgEditorOption());
      diffEditor.updateOptions(rpgEditorOption());

    }

    const extraRulerChange = document.getElementById('control-extraRuler');
    extraRulerChange.addEventListener('click', (e) => {
      rulerChange(e.target.checked);
    });

    const extraTerminal = document.getElementById('control-extraTerminal');
    extraTerminal.addEventListener('click', (e) => {
      //monaco.editor.showCommands();
    });
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
    window.testCreateRefList = async () => {
      const model = await normalEditor.getModel();
      await createRefList(model);
    }
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
      console.log(dds, dsp);
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
  set setHandleSeparate(handle_sepa) {
    this.handleSeparate = handle_sepa;
    this.save();
  }
  set setTheme(theme) {
    this.theme = theme;
    this.save();
  }

  save() {
    idbKeyval.set('monaco-setting', this);
  }
}

var linkStatus = {};
class linkStatusClass {
  constructor() {
    this.handle = null;
    this.ishandle = false;
  }
}