# Visual Rebase

Simplify interactive `git rebase` with an easy-to-use visual editor directly inside Visual Studio Code.

## Features
* **Auto-activation**: Automatically intercepts `git-rebase-todo` files when you start an interactive rebase.
* **Clean Interface**: Say goodbye to manually editing text files. Manage your commits through a modern UI.
* **Safe Abort**: Easily cancel the rebase process directly from the interface without worrying about left-over git lock files.

## How to Use
1. Ensure VS Code is set as your default Git editor. If it isn't, run this command in your terminal:
```bash
git config --global core.editor "code --wait"
```
2. Start an interactive rebase from your terminal as usual:
```bash
git rebase -i HEAD~2
```
3. The Visual Rebase interface will automatically open in VS Code!

## Requirements
- Visual Studio Code v1.110.0 or higher.
- Git installed and available in your system's PATH.

## Release Notes
### 0.0.1
* Initial release of Visual Rebase.
* Introduced automatic interception of `git-rebase-todo` files.
* Added a modern webview UI for managing commits.
* Implemented a secure "Cancel Rebase" action.

### 0.0.2
* Add `Commit` button to commit and not push (if you are working on local repo/branch for example)