import * as vscode from "vscode";
import { Commit } from "./types";
import { rebaseWebview } from "./rebaseWebview";

export function activate(context: vscode.ExtensionContext) {
  console.log("visual-rebase active");

  const disposable = vscode.workspace.onDidOpenTextDocument(
    async (document) => {
      if (document.fileName.endsWith("git-rebase-todo")) {
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

        await rebaseWebview(commits, comments, document, context);
      }
    },
  );
  context.subscriptions.push(disposable);
}

export function deactivate() {}
