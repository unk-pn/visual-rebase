import { Commit } from "../types";
import { getStyles } from "./styles";
import { getScripts } from "./scripts";

export function webviewHtml(commits: Commit[]): string {
  const displayedCommits = [...commits].reverse();
  const commitsHtml = displayedCommits
    .map(
      (c) =>
        `<div class="commit-card">
          <span class="commit-hash">${c.hash}</span>
          <span class="commit-message">${c.message}</span>
        </div>`,
    )
    .join("");

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Interactive Rebase</title>
      <style>
        ${getStyles()}
      </style>
    </head>
    <body>
      <h2>Visual Rebase</h2>

      <div class="commits-list">
        ${commitsHtml}
      </div>

      <div class="action-container">
        <label>Select Action:</label>
        <select id="actionSelect" class="action-select">
          <option value="squash" selected>SQUASH</option>
          <option value="reword">REWORD</option>
          <option value="edit">EDIT</option>
          <option value="fixup">FIXUP</option>
          <option value="drop">DROP</option>
          <option value="pick">PICK</option>
        </select>
      </div>

      <div class="footer">
        <button class="btn-cancel" id="cancelBtn">Cancel</button>
        <button class="btn-commit" id="commitBtn">Commit</button>
        <button class="btn-push" id="applyBtn">Apply and Push</button>
      </div>

      <script>
        ${getScripts(commits)}
      </script>
    </body>
    </html>
  `;
}
