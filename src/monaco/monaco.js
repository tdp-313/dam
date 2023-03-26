require.config({ paths: { vs: "./lib/min/vs" } });

const monacoStart = () => {
  require(["vs/editor/editor.main"], function () {
    // 通常のエディターを作成
    monaco.languages.register({ id: 'rpg' });
    monaco.languages.setLanguageConfiguration('rpg', {
      brackets: [
        ['IF', 'END'],
      ],
    });
    monaco.languages.setMonarchTokensProvider('rpg', {
      operators: [
        'IFEQ ', 'IFNE ', 'IFLT ', 'IFGT ', 'IFLE ', 'IFGE ','ENDIF',
        'CABEQ', 'CABNE', 'CABLT', 'CABGT', 'CABLE', 'CABGE','END',
        'DOEQ ', 'DONE ', 'DOLT ', 'DOGT ', 'DOLE ', 'DOGE ', 'DO   ', 'ENDDO',
        'BEGSR' ,'ENDSR',
      ],
      keywords: [
        'break', 'case', 'catch', 'class', 'continue', 'const',
        'constructor', 'debugger', 'default', 'delete', 'do', 'else',
        'export', 'extends', 'false', 'finally', 'for', 'from', 'function',
        'get', 'if', 'import', 'in', 'instanceof', 'let', 'new', 'null',
        'return', 'set', 'super', 'switch', 'symbol', 'this', 'throw', 'true',
        'try', 'typeof', 'undefined', 'var', 'void', 'while', 'with', 'yield',
        'async', 'await', 'of'
      ],
      IOs: [
        'WRITE','UPDAT','DELET'
      ],
      PreIOs: [
        'SETLL','SETGT','READE','READ ','CHAIN','REDPE','READP'
      ],
      tokenizer: {
        root: [
          [/.{7}\*.*/, { token: 'comment' }],
          [/^(.{1,6})(C)(..)(.{1,2})(.{1,2})(.{1,2})(..)(.{1,10})(.{1,5})(.{1,10})(.{1,6})(.)(.{1,2})(.)(.{1,2})(.{1,2})(.{1,2})(.*)$/,
            ['comment', 'tag', 'token-3', 'flag1', 'flag2', 'flag3', '', 'variable', {
              cases: {
                '@keywords': 'token-3',
                '@operators': 'token-3',
                '@IOs': 'IO',
                '@PreIOs':'PreIOs',
                '@default': 'order'
              }
            }, 'number', 'variable', '', 'number', 'type', 'flag1', 'flag2', 'flag3', ''
            ]
          ],
        ],
        tag: [
          [/IF/, { token: 'keyword', next: '@root' }],
          [/ENDIF/, { token: 'keyword' }],
          [/[a-z]+/, { token: 'identifier' }],
        ]
      }
    });
    monaco.editor.defineTheme('myTheme', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'token-3', foreground: '#DDDD00' },
        { token: 'IO', foreground: '#DD2000' },
        { token: 'PreIOs', foreground: '#DD8000' },
        { token: 'flag1', foreground: '#0030DB' },
        { token: 'flag2', foreground: '#0060DB' },
        { token: 'flag3', foreground: '#0090DB' },
        { token: 'order', foreground: '#DD00DD' }
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
      theme: "vs-dark",
      locale: 'ja',
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
      rulers: [6, 7, 17, 27, 32, 42, 48, 51, 52, 58],
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
      }
      else {
        diff.left = await monaco.editor.createModel(text, lang);
        diff.right = await monaco.editor.createModel(text2, lang);
        diffEditor.setModel({
          original: diff.left,
          modified: diff.right,
        });
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