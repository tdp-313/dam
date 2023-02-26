const $ = require( "jquery" );
const idbKeyval = require("idb-keyval/dist/umd.js");
const Viewer = require('@toast-ui/editor/dist/toastui-editor-viewer');

//require('@toast-ui/chart/dist/toastui-chart.css');
//require('@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight.css');
//require('prismjs/themes/prism.css');
//require('tui-color-picker/dist/tui-color-picker.css');
//require('@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css');
//require('@toast-ui/editor-plugin-table-merged-cell/dist/toastui-editor-plugin-table-merged-cell.css');

const codeSyntaxHighlight = require('@toast-ui/editor-plugin-code-syntax-highlight/dist/toastui-editor-plugin-code-syntax-highlight-all');
const chart = require('@toast-ui/editor-plugin-chart');
const tableMergedCell = require('@toast-ui/editor-plugin-table-merged-cell');
//const uml = require('@toast-ui/editor-plugin-uml');

window.onload = async () =>{
  await markdownStart();
  let text = '';
  let title = '';
  try {
    text = await window.opener.Editor_root.getMarkdown();
    title = await window.opener.editing_markdownFileName;
    if (title.length > 3) {
      title = title.substring(title.length - 3, title.length) === '.md' ? title.substring(0, title.length - 3) : title;
    }
    $("title").html(title);
    $('#markdown_text').text(text);
  } catch (error) {
    text = $('#markdown_text').text();
  }
  await markdown_set(text);
}

async function markdownStart(text = '') {
  const viewer = new Viewer({
    el: document.querySelector('#viewer'),
    height: '100vh',
    initialValue: '!! no data load !!',
    plugins: [chart, codeSyntaxHighlight, tableMergedCell],
  });
  Viewer_root = viewer;
}

let Viewer_root = null;

async function markdown_set(text) {
  await Viewer_root.setMarkdown(text);
}


$(document).on('click', 'pre', (e) => {
  let copyText = e.target.firstChild.innerText;
  if (typeof (copyText) === 'string') {
    navigator.clipboard.writeText(copyText).then(() => {
      /* clipboard successfully set */
    }, (error) => {
      window.alert(('no-Copy Reason clipboard error',error));
    });
  } else {
    window.alert('no-Copy Reason by TypeOf->' + typeof (copyText));
  }
});
