require.config({
  paths: {
    'vs': "./lib/min/vs"
  }
});

const monacoStart = () => {

  require(["vs/editor/editor.main"], function () {
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
      autoClosingPairs: [
        { open: '{', close: '}' },
      ]
    });
    monaco.languages.setMonarchTokensProvider('rpg', rpg_token());
    monaco.languages.setMonarchTokensProvider('rpg-indent', rpg_token2());
    monaco.editor.defineTheme('myTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'Operation', foreground: '#DDDD00' },
        { token: 'IO', foreground: '#DD2000' },
        { token: 'PreIOs', foreground: '#DD8000' },
        { token: 'flag1', foreground: '#0030DB' },
        { token: 'flag2', foreground: '#0060DB' },
        { token: 'flag3', foreground: '#0090DB' },
        { token: 'order', foreground: '#DD00DD' },
        { token: 'error', foreground: 'ff0000' }
      ],
      colors: {}
    });
    var normalEditor = monaco.editor.create(document.getElementById('monaco-code'), {
      value: '12345678 *comment\nabcdefghijk\nlmnopqrs *\nuvwxyz',
      language: 'vba',
      automaticLayout: true,
      emptySelectionClipboard: true,
      mouseWheelZoom: true,
      scrollBeyondLastLine: false,
      theme: "myTheme",
      locale: 'ja',
      overwriteEmptySpaces: 'overwrite',
    });
    normalEditor.updateOptions({

    });
    // 差分エディターを作成
    var diffEditor = monaco.editor.createDiffEditor(document.getElementById('monaco-diff'), {
      renderSideBySide: true,
      enableSplitViewResizing: false,
      language: 'rpg',
      autoIndent: "advanced",
      automaticLayout: true,
      emptySelectionClipboard: true,
      mouseWheelZoom: true,
      scrollBeyondLastLine: false,
      theme: "myTheme",
      overwriteEmptySpaces: 'overwrite',
    });

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
    });
    const modeChangeDiff = document.getElementById('control-EditorModeChange-diff');
    modeChangeDiff.addEventListener('click', (e) => {
      setModeChange('diff');
      diffEditor.layout();
    });
    window.monacoRead = async (text, lang, text2 = "") => {
      if (text2.length === 0) {
        normalEditor.setValue(text);
        const model = normalEditor.getModel();
        monaco.editor.setModelLanguage(model, lang)
        normalEditor.updateOptions({ rulers: [15, 16, 27, 37, 55, 60, 70, 76, 79, 81, 87] });
        nowLang = lang;
      }
      else {
        diff.left = await monaco.editor.createModel(text, lang);
        diff.right = await monaco.editor.createModel(text2, lang);
        diffEditor.setModel({
          original: diff.left,
          modified: diff.right,
        });
        diffEditor.updateOptions({ rulers: [5, 6, 17, 27, 32, 42, 48, 51, 53, 59] });
      }
    }
  });
}
window.onload = async () => {
  monacoStart();
  readFileButtonCreate();
}

const setModeChange = (mode) => {
  if (mode === 'code') {
    document.getElementById('monaco-code').style.display = 'block';
    document.getElementById('monaco-diff').style.display = 'none';
  } else {
    document.getElementById('monaco-code').style.display = 'none';
    document.getElementById('monaco-diff').style.display = 'block';
  }
}