import { spawn } from "child_process";
import fs from "fs";

/**
 * Helper funciton to await a defined amount of time.
 */
export const delay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

/**
 * Start a tunnel as a child process, and listen for its stdout.
 */
export const startTunnelProcess = async ({
  command,
  args
}: {
  command: string;
  args: string[];
}) => {
  console.log(`>> Starting tunnel: ${command} ${args.join(" ")}`);

  const outLogFile = "/tmp/tunnels/stdout.log";
  const errLogFile = "/tmp/tunnels/stderr.log";

  const out = fs.openSync(outLogFile, "w");
  const err = fs.openSync(errLogFile, "w");

  const tunnel = spawn(command, args, {
    detached: true,
    stdio: ["ignore", out, err]
  });

  tunnel.unref();

  let saveTunnelUrl: string | undefined;
  let saveTunnelFailed: string | undefined = "Tunnel failed to start.";

  tunnel.on("close", code => {
    if (code === null) {
      console.log(`Tunnel process exited with code null`);
      return;
    }

    console.log(`Tunnel process exited with code ${code}`);
  });

  process.on("SIGINT", () => {
    console.log(`Process was terminated with SIGINT (Ctrl-C).`);
    process.exit(0);
  });

  process.on("SIGTERM", () => {
    console.log(`Process was terminated with SIGTERM.`);
    process.exit(0);
  });

  console.log(`>> Waiting for tunnel url to be set.`);

  for (let i = 0; i < 50; i++) {
    const fileExists = fs.existsSync("/tmp/tunnels/stdout.log");

    if (fileExists) {
      const fileContents = fs.readFileSync("/tmp/tunnels/stdout.log", "utf8");
      if (fileContents.includes("your url is: ")) {
        saveTunnelFailed = undefined;
        saveTunnelUrl = fileContents.replace("your url is: ", "").trim();
        console.log(`>> Tunnel URL is: ${saveTunnelUrl}`);
      }
    }

    if (saveTunnelUrl) {
      break;
    }
    await delay(200);
  }
  const tunnelUrl = saveTunnelUrl;
  const tunnelFailed = saveTunnelFailed;

  fs.closeSync(err);
  fs.closeSync(out);

  return {
    tunnelUrl,
    tunnelFailed,
    tunnel
  };
};
