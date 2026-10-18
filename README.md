# Visual Rebase

Simplify interactive `git rebase` with an easy-to-use visual editor directly inside Visual Studio Code.

## Features
* **Auto-activation**: Automatically intercepts `git-rebase-todo` files when you start an interactive rebase.
* **Multi-Editor Support**: Works seamlessly out of the box with VS Code, VSCodium, Cursor, and custom forks without modifying your global git config.
* **Clean Interface**: Say goodbye to manually editing text files. Manage your commits through a modern UI.
* **Safe Abort**: Easily cancel the rebase process directly from the interface without worrying about left-over git lock files.

## Configuration
* `visualRebase.editor`: Editor to use for git rebase in integrated terminal (`auto`, `code`, `codium`, `cursor`, `custom`). Default is `auto`.
* `visualRebase.customEditorCommand`: Custom command/binary when `editor` is set to `custom`.
* `visualRebase.defaultAction`: Default rebase action selected in the dropdown list (`squash`, `fixup`, `reword`, `edit`, `drop`, `pick`). Default is `squash`.

## How to use

1. Start interactive rebase in your terminal:
```bash
git rebase -i HEAD~X # X - count of commits
```
2. The Visual Rebase window will open automatically in your editor.

## Requirements
- Visual Studio Code v1.110.0 or higher (or compatible forks like VSCodium, Cursor).
- Git installed and available in your system's PATH.

## Installation

### From Marketplace (Recommended)
Install directly from the [Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=unk.visual-rebase) or search inside your editor:
1. Open the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
2. Search for **`Visual Rebase`**.
3. Click **Install**.

### Manual Installation (.vsix)
1. Download the latest `.vsix` file from the [GitHub Releases page](https://github.com/unk-pn/visual-rebase/releases/latest).
2. Open VS Code and go to the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X`).
3. Click the `...` (Views and More Actions) menu at the top right of the Extensions panel.
4. Select **Install from VSIX...** and choose the downloaded file.