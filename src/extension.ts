import { commands, ExtensionContext } from 'vscode';

import { spellCheck, spellFix } from './commands';

export function activate(context: ExtensionContext) {
  context.subscriptions.push(
    commands.registerCommand('spell.check', spellCheck)
  );

  context.subscriptions.push(
    commands.registerCommand('spell.fix', spellFix)
  );
}

export function deactivate() { }
