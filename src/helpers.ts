import { spawn } from "child_process";

const DEBUG_OUTPUT = false;

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
  const tunnel = spawn(command, args);

  let saveTunnelUrl: string | undefined;
  let saveTunnelFailed: string | undefined;

  tunnel.stdout.on("data", data => {
    const stringData = `${data}`;
    console.log(`stdout: ${stringData}`);

    // If the tunnel URL is not yet set, then we will set it.
    if (!saveTunnelUrl && stringData.startsWith("your url is: ")) {
      saveTunnelUrl = stringData.replace("your url is: ", "").trim();
      console.log(`>> Tunnel URL is: ${saveTunnelUrl}`);
    }
  });

  tunnel.stderr.on("data", data => {
    const stringData = `${data}`;
    if (!stringData) {
      return;
    }
    if (DEBUG_OUTPUT) {
      console.error(`stderr: ${data}`);
    }

    saveTunnelFailed = stringData;
  });

  tunnel.on("close", code => {
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
    if (!saveTunnelUrl && !saveTunnelFailed) {
      await delay(200);
    }
  }
  const tunnelUrl = saveTunnelUrl;
  const tunnelFailed = saveTunnelFailed;

  return {
    tunnelUrl,
    tunnelFailed,
    tunnel
  };
};
