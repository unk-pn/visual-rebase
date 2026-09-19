const vscode = acquireVsCodeApi();
let originalCommits = [];

window.addEventListener('message', event => {
  const message = event.data;

  if (message.command === "initData") {
    originalCommits = message.data;
    renderCommits();
  }
});

function renderCommits() {
  const container = document.getElementById('commits-list');
  container.innerHTML = '';

  const displayedCommits = [...originalCommits].reverse();

  displayedCommits.forEach((commit) => {
    const card = document.createElement('div');
    card.className = 'commit-card';
    card.innerHTML = `
      <span class="commit-hash">${commit.hash}</span>
      <span class="commit-message">${commit.message}</span>
    `;
    container.appendChild(card);
  });
}

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

