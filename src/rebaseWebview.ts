import { Commit } from "./types";
import * as vscode from "vscode";
import { exec } from "child_process";
import { webviewHtml } from "./webview";

export async function rebaseWebview(
  commits: Commit[],
  comments: string[],
  document: vscode.TextDocument,
) {
  const panel = vscode.window.createWebviewPanel(
    "visualRebase",
    "Visual Rebase",
    vscode.ViewColumn.Active,
    { enableScripts: true },
  );

  panel.webview.html = webviewHtml(commits);

  panel.webview.onDidReceiveMessage(async (message) => {
    if (message.command === "applyRebase") {
      const updatedCommits: Commit[] = message.data;

      const newContent =
        updatedCommits
          .map((c) => `${c.action} ${c.hash} ${c.message}`)
          .join("\n") +
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

      await vscode.window.showTextDocument(document.uri);
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
      panel.dispose();

      vscode.window.showInformationMessage(
        "Rebase applied, waiting for Push...",
      );

      const workspaceFolders = vscode.workspace.workspaceFolders;
      if (workspaceFolders) {
        const cwd = workspaceFolders[0].uri.fsPath;

        setTimeout(() => {
          exec("git push --force-with-lease", { cwd }, (error) => {
            if (error) {
              vscode.window.showErrorMessage(`Push error: ${error.message}}`);
              console.error(`Git error: ${error}}`);
              return;
            }
            vscode.window.showInformationMessage("Successful push");
          });
        }, 2000);
      } else {
        vscode.window.showWarningMessage(
          "Could not determine project folder for push.",
        );
      }
    }

    if (message.command === "cancelRebase") {
      const edit = new vscode.WorkspaceEdit();
      const fullRange = new vscode.Range(
        document.lineAt(0).range.start,
        document.lineAt(document.lineCount - 1).range.end,
      );

      edit.replace(document.uri, fullRange, "");
      await vscode.workspace.applyEdit(edit);
      await document.save();

      await vscode.window.showTextDocument(document.uri);
      await vscode.commands.executeCommand(
        "workbench.action.closeActiveEditor",
      );
      panel.dispose();

      vscode.window.showWarningMessage("Rebase aborted.");
    }
  });
}
