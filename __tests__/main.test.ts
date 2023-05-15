import * as process from "process";
import * as cp from "child_process";
import * as path from "path";
import { test } from "@jest/globals";

test("test runs", () => {
  process.env["INPUT_PORTS"] = "3000,4000";
  const np = process.execPath;
  const mainFile = path.join(__dirname, "..", "lib", "main.js");
  const cleanupFile = path.join(__dirname, "..", "lib", "cleanup.js");
  const options: cp.ExecFileSyncOptions = {
    env: process.env
  };
  console.log(cp.execFileSync(np, [mainFile], options).toString());
  console.log(cp.execFileSync(np, [cleanupFile], options).toString());
});
