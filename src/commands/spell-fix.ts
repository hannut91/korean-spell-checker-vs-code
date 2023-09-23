import {
  window, TextEditorEdit, Position, Range, Selection, TextLine
} from 'vscode';
import { range, curry } from 'lodash';
import * as _ from 'lodash';

import { fix } from '../services/spell-checker';

const MAX_TEXT_COUNT = 500;

const getText = curry((textline: TextLine, selection: Selection) => {
  const { lineNumber } = textline;
  if (lineNumber === selection.start.line) {
    return new Range(
      selection.start, textline.rangeIncludingLineBreak.end);
  }

  if (lineNumber === selection.end.line) {
    return new Range(textline.range.start, selection.end);
  }

  return textline.rangeIncludingLineBreak;
});

export const spellFix = async () => {
  const editor = window.activeTextEditor;
  if (!editor) {
    window.showInformationMessage('선택된 에디터가 없습니다.');
    return;
  }

  if (!editor.document.getText(editor.selection)) {
    window.showInformationMessage('선택된 텍스트가 없습니다.');
    return;
  }

  let { selection, document } = editor;

  let originText = '';

  if (selection.isSingleLine) {
    originText = document.getText(selection);
    if (originText.length >= MAX_TEXT_COUNT) {
      originText = originText.slice(0, MAX_TEXT_COUNT);
      selection = new Selection(
        selection.start,
        new Position(selection.start.line, selection.start.character + originText.length)
      );
    }
  } else {
    range(selection.start.line, selection.end.line + 1)
      .map(document.lineAt)
      .map(getText(_, selection))
      .map(document.getText)
      .every((text: string, index: number) => {
        let result = true;
        if (originText.length + text.length >= MAX_TEXT_COUNT) {
          text = text.slice(0, MAX_TEXT_COUNT - originText.length);
          selection = new Selection(
            selection.start,
            new Position(selection.start.line + index, text.length),
          );
          result = false;
        }

        originText += text;
        return result;
      });
  }

  try {
    const notag_html = await fix(originText);

    editor.edit((editBuilder: TextEditorEdit) => {
      editBuilder.replace(selection, notag_html);
      editor.selection = selection;
    });
  } catch (err) {
    window.showInformationMessage(
      `교정된 텍스트를 불러오는데 실패했습니다. err: ${(err as any).message}`, );
  }
};
