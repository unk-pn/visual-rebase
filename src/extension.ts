import * as vscode from "vscode";
import { exec } from "child_process";

interface Commit {
  action: string;
  hash: string;
  message: string;
}

interface CommitMenuItem extends vscode.QuickPickItem {
  commitIndex?: number;
}

const actionItems: vscode.QuickPickItem[] = [
  { label: "pick", description: "Использовать коммит (оставить как есть)" },
  {
    label: "reword",
    description: "Изменить сообщение коммита (откроется редактор)",
  },
  { label: "edit", description: "Остановиться для изменения файлов" },
  {
    label: "squash",
    description: "Объединить с предыдущим коммитом (оставить сообщение)",
  },
  {
    label: "fixup",
    description: "Объединить с предыдущим (удалить сообщение)",
  },
  { label: "drop", description: "Удалить коммит" },
];

export function activate(context: vscode.ExtensionContext) {
  console.log("visual-rebase active");

  const disposable = vscode.workspace.onDidOpenTextDocument(
    async (document) => {
      if (document.fileName.endsWith("git-rebase-todo")) {
        // await vscode.commands.executeCommand(
        //   "workbench.action.closeActiveEditor",
        // );
        const content = document.getText();

        const lines = content.split("\n");
        const commits: Commit[] = [];
        const comments: string[] = [];

        for (const line of lines) {
          if (line.trim().startsWith("#") || line.trim() === "") {
            comments.push(line);
            continue;
          }

          const parts = line.trim().split(" ");
          if (parts.length >= 3) {
            commits.push({
              action: parts[0],
              hash: parts[1],
              message: parts.slice(2).join(" "),
            });
          } else {
            comments.push(line);
          }
        }

        await showActiveRebaseWindow(commits, comments, document);
      }
    },
  );
  context.subscriptions.push(disposable);
}

async function showActiveRebaseWindow(
  commits: Commit[],
  comments: string[],
  document: vscode.TextDocument,
) {
  while (true) {
    const items: CommitMenuItem[] = [
      {
        label: "$(save) Применить и завершить",
        description: "Записать изменения и продолжить rebase",
        alwaysShow: true,
      },
      ...commits.map((commit, index) => ({
        label: `${commit.action} ${commit.hash}`,
        description: commit.message,
        commitIndex: index,
      })),
    ];

    const selection = await vscode.window.showQuickPick(items, {
      placeHolder: 'Выберите коммит для изменения или нажмите "Применить"',
      ignoreFocusOut: true,
    });

    if (!selection) {
      vscode.window.showWarningMessage("Rebase прерван (меню закрыто)");
      return;
    }

    if (selection.label.includes("Применить и завершить")) {
      const newContent =
        commits.map((c) => `${c.action} ${c.hash} ${c.message}`).join("\n") +
        "\n" +
        comments.join("\n");

      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.lineAt(0).range.start,
        document.lineAt(document.lineCount - 1).range.end,
      );

      edit.replace(document.uri, fullRange, newContent);
      await vscode.workspace.applyEdit(edit);
      await document.save();
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders) {
        const cwd = workspaceFolders[0].uri.fsPath;

        setTimeout(() => {
          exec(
            "git push --force-with-lease",
            { cwd },
            (error, stdout, stderr) => {
              if (error) {
                vscode.window.showErrorMessage(`Push error: ${error.message}}`);
                console.error(`Git error: ${error}}`);
                return;
              }
              vscode.window.showInformationMessage("Successful push");
            },
          );
        }, 2000);
      } else {
        vscode.window.showWarningMessage(
          "Не удалось определить папку проекта для пуша.",
        );
      }

      vscode.window.showInformationMessage("Rebase успешно применен!");
      break;
    }

    const index = selection.commitIndex!;

    const actionSelection = await vscode.window.showQuickPick(actionItems, {
      placeHolder: `Выберите действие для ${commits[index].hash}: ${commits[index].message}`,
      ignoreFocusOut: true,
    });

    if (actionSelection) {
      commits[index].action = actionSelection.label;
    }
  }
}

export function deactivate() {}
