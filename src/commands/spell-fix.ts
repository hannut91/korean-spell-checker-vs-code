import { window, TextEditorEdit } from 'vscode';

import { SpellCheck } from '../services/spell-checker';

export const spellFix = async () => {
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
    const { notag_html } = await SpellCheck(text);

    editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(editor.selection, notag_html);
    });
  } catch (err) {
    window.showInformationMessage(
      '교정된 텍스트를 불러오는데 실패했습니다. err: ', err);
  }
};
