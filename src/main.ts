import * as core from "@actions/core";
import * as github from "@actions/github";
import { execSync } from "child_process";
import { nanoid } from "nanoid";

import { startTunnelProcess } from "./helpers";
import { savePIDToFile } from "./processManagement";

const installLocalTunnel = () => {
  console.log(">> Installing localtunnel...");
  execSync("npm install -g localtunnel");
};

installLocalTunnel();

async function run(): Promise<void> {
  try {
    let subdomain = core.getInput("subdomain");

    const ports = core
      .getInput("ports", {
        required: true
      })
      .split(",");

    const currentBranchName = github.context.ref;
    if (currentBranchName) {
      subdomain =
        currentBranchName.replace("refs/heads/", "") +
        "-" +
        github.context.repo.repo;
    }

    if (!subdomain) {
      subdomain = nanoid().toLowerCase();
    }

    subdomain = subdomain.replace(/[^a-z0-9]/gi, "");

    for (const port of ports) {
      const subdomainWithPort = `${subdomain}-${port}`;

      const args = [
        "localtunnel",
        "--port",
        port,
        "--subdomain",
        subdomainWithPort
      ];

      const data = await startTunnelProcess({
        command: "npx",
        args
      });
      if (data.tunnelFailed) {
        core.setFailed(data.tunnelFailed);
      } else {
        core.setOutput("tunnelUrl-port-" + port, data.tunnelUrl);
      }
      savePIDToFile(data.tunnel.pid ?? 0);
    }

    process.exit(0);
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

void run();
