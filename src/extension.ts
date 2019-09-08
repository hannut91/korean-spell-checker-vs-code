import * as vscode from 'vscode';
import { ViewColumn, WebviewPanel, TextEditor, window, } from 'vscode';
import { SpellCheck } from './spell-checker';

const STYLE = `
<style>
.red_text { color: red; }
.green_text { color: green; }
.blue_text { color: blue; }
.violet_text { color: purple; }
</style>
`;

const selectedText = (editor: TextEditor) =>
	editor.document.getText(editor.selection);

export function activate(context: vscode.ExtensionContext) {
	let panel: any;

	const disposable = vscode.commands
		.registerCommand('extension.spell', async () => {
			const editor = vscode.window.activeTextEditor;
			if (!editor) {
				vscode.window.showInformationMessage('선택된 에디터가 없습니다.');
				return;
			}

			const text = selectedText(editor);
			if (!text) {
				vscode.window.showInformationMessage('선택된 텍스트가 없습니다.');
				return;
			}

			try {
				const result = await SpellCheck(text);

				if (!panel) {
					panel = vscode.window.createWebviewPanel(
						'spell-checker',
						'SpellChecker',
						ViewColumn.Beside
					);

					panel.onDidDispose(() => panel = undefined);
				}

				panel.webview.html = STYLE + result;
			} catch (err) {
				vscode.window.showInformationMessage(
					'교정된 텍스트를 불러오는데 실패했습니다. err: ', err);
			}
		});

	context.subscriptions.push(disposable);
}

export function deactivate() { }
