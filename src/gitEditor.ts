import * as vscode from "vscode";
import { Editor } from "./types";

export function updateGitSequenceEditor(context: vscode.ExtensionContext) {
  const config = vscode.workspace.getConfiguration("visualRebase")
  const selectedEditor = config.get<Editor>("editor", "auto")
  const customCommand = config.get<string>("customEditorCommand", "").trim()

  const cliCommand = (function getCliCommand() {
    if (selectedEditor === "custom" && customCommand)
      return customCommand
    
    if (selectedEditor !== "auto") 
      return selectedEditor
    
    const appName = vscode.env.appName.toLowerCase()
    if (appName.includes("codium")) 
      return "codium";

    if (appName.includes("cursor"))
      return "cursor";

    
    return "code";
  })()

  context.environmentVariableCollection.replace(
    "GIT_SEQUENCE_EDITOR",
    `${cliCommand} --wait`
  )

  context.environmentVariableCollection.description =
    "Visual Rebase: Git sequence editor";
}