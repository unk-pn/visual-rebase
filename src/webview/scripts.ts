import { Commit } from "../types";

export function getScripts(commits: Commit[]): string {
  const commitsJson = JSON.stringify(commits);

  return `
    const vscode = acquireVsCodeApi();
    const originalCommits = ${commitsJson};

    document.getElementById('applyBtn').addEventListener('click', () => {
      const selectedAction = document.getElementById('actionSelect').value;

      const updatedCommits = originalCommits.map((c, index) => {
        if (index === 0 && originalCommits.length > 1) {
          return { ...c, action: 'pick' };
        }
        return { ...c, action: selectedAction };
      });

      vscode.postMessage({
        command: 'applyRebase',
        data: updatedCommits
      });
    });

    document.getElementById('commitBtn').addEventListener("click", () => {
      const selectedAction = document.getElementById('actionSelect').value;

      const updatedCommits = originalCommits.map((c, index) => {
        if (index === 0 && originalCommits.length > 1) {
          return { ...c, action: 'pick' };
        }
        return { ...c, action: selectedAction };
      });

      vscode.postMessage({
        command: 'commitRebase',
        data: updatedCommits
      });
    });

    document.getElementById('cancelBtn').addEventListener('click', () => {
      vscode.postMessage({
        command: 'cancelRebase'
      });
    });
  `;
}
