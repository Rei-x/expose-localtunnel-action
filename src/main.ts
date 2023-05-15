import * as core from "@actions/core";
import * as github from "@actions/github";
import { execSync } from "child_process";
import { mkdirSync } from "fs";
import { nanoid } from "nanoid";

import { startTunnelProcess } from "./helpers";
import { savePIDToFile } from "./processManagement";

const installLocalTunnel = () => {
  console.log(">> Installing localtunnel...");
  execSync("npm install -g localtunnel");
};

mkdirSync("/tmp/tunnels", { recursive: true });

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
      subdomain = nanoid().toLowerCase().replace(/_/g, "");
    }

    const globalNodeModules = execSync("npm root -g").toString().trim();

    for (const port of ports) {
      const subdomainWithPort = `${subdomain}-${port}`;

      const args = [
        `${globalNodeModules}/localtunnel/bin/lt`,
        "--port",
        port,
        "--subdomain",
        subdomainWithPort
      ];

      const data = await startTunnelProcess({
        command: "node",
        args
      });

      if (data.tunnelFailed) {
        core.setFailed(data.tunnelFailed);
      } else {
        core.setOutput("tunnelUrl-port-" + port, data.tunnelUrl);
      }

      savePIDToFile(data.tunnel.pid ?? 0);
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

void run();
