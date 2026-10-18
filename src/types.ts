export interface Commit {
  action: string;
  hash: string;
  message: string;
}

export type Editor = "auto" | "code" | "codium" | "cursor" | "custom";