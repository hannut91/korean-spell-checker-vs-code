import { window, ViewColumn } from 'vscode';

import { SpellCheck } from '../services/spell-checker';

const STYLE = `<style>
.red_text { color: red; }
.green_text { color: green; }
.blue_text { color: blue; }
.violet_text { color: purple; }
</style>`;

let panel: any;

export const spellCheck = async () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    window.showInformationMessage('선택된 에디터가 없습니다.');
    return;
  }

  const text = editor.document.getText(editor.selection);
  if (!text) {
    window.showInformationMessage('선택된 텍스트가 없습니다.');
    return;
  }

  try {
    const { html } = await SpellCheck(text);

    if (!panel) {
      panel = window.createWebviewPanel(
        'spell-checker',
        'SpellChecker',
        ViewColumn.Beside
      );

      panel.onDidDispose(() => panel = undefined);
    }

    panel.webview.html = STYLE + html;
  } catch (err) {
    window.showInformationMessage(
      '교정된 텍스트를 불러오는데 실패했습니다. err: ', err);
  }
};
