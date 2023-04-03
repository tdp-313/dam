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
          if (op_m === 'PARM') {
            if (wordStr === result) {
              ranges.push({ range: new monaco.Range(i, 1, i, 70), uri: model.uri });
            }
          } else if (op_m === 'PLIST' || op_m === 'KLIST' || op_m === 'BEGSR') {
            if (wordStr === op_1) {
              ranges.push({ range: new monaco.Range(i, 1, i, 70), uri: model.uri });
            }
          } else {
            if (wordStr === result && fieldLen !== '') {
              ranges.push({ range: new monaco.Range(i, 1, i, 70), uri: model.uri });
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
          let op_1 = row.substring(17, 27).trim();
          //let op_m = row.substring(45, 50).trim();
          let op_2 = row.substring(50, 60).trim();
          //let fieldLen = row.substring(67, 70).trim();
          let result = row.substring(60, 66).trim();
          if (wordStr === op_1 || wordStr === op_2 || wordStr === result) {
            ranges.push({ range: new monaco.Range(i, 1, i, 70), uri: model.uri });
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

        // 折りたたみ範囲の開始行と終了行を格納する変数


        // 1行ずつループ
        for (let lineNumber = 1; lineNumber <= lineCount; lineNumber++) {
          // 行のテキストを取得
          var lineText = model.getLineContent(lineNumber);
          // 折りたたみ範囲の開始行を判定
          let plus = lineText.substring(37, 55).indexOf("{");
          if (plus !== -1) {
            // 折りたたみ範囲が開始された
            let startLineNumber = -1;
            let endLineNumber = -1;
            startLineNumber = lineNumber;
            for (let endLineRow = startLineNumber + 1; endLineRow <= lineCount; endLineRow++) {

              let endlineText = model.getLineContent(endLineRow);
              if (endlineText.substring(37, 55).substr(plus, 1) === "}") {
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
              } /*else if (endlineText.substring(37, 55).substr(plus, 1) === "+") {
                // 折りたたみ範囲 else
                endLineNumber = endLineRow - 1;
                // 折りたたみ範囲を配列に追加
                if (startLineNumber !== -1 && endLineNumber !== -1) {
                  ranges.push({ start: startLineNumber, end: endLineNumber });
                  startLineNumber = endLineRow;
                }
              }*/
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

    // 初期表示は通常のエディターにする
    document.getElementById('monaco-code').style.display = 'none';
    document.getElementById('monaco-diff').style.display = 'block';

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
    window.monacoRead = async (text, lang, text2 = "") => {
      ruler_State = true;
      if (text2.length === 0) {
        normalEditor.setValue(text);
        const model = normalEditor.getModel();
        monaco.editor.setModelLanguage(model, lang)
        nowLang = lang;
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
      monaco.editor.showCommands();
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