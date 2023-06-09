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

const getBranchName = () => {
  try {
    const branchName = execSync("git branch --show-current");

    return branchName.toString().trim();
  } catch (error) {
    console.log(error);
  }

  if (process.env.GITHUB_HEAD_REF) {
    return process.env.GITHUB_HEAD_REF;
  }

  if (process.env.GITHUB_REF) {
    return process.env.GITHUB_REF.replace("refs/heads/", "");
  }

  return undefined;
};

async function run(): Promise<void> {
  try {
    let subdomain = core.getInput("subdomain");

    const ports = core
      .getInput("ports", {
        required: true
      })
      .split(",");

    const currentBranchName = getBranchName();

    if (currentBranchName) {
      subdomain = currentBranchName;

      try {
        subdomain = `${subdomain}-${github.context.repo.repo}`;
      } catch (error) {
        console.log(error);
      }

      if (subdomain.length > 58) {
        subdomain = subdomain.substring(0, 58);
      }
    }

    if (!subdomain) {
      subdomain = nanoid().toLowerCase();
    }

    // replace all non-alphanumeric characters with a dash

    subdomain = subdomain.replace(/[^a-zA-Z0-9]/g, "-");

    const globalNodeModules = execSync("npm root -g").toString().trim();

    let index = 1;

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
        core.setOutput("url-" + index, data.tunnelUrl);
      }

      savePIDToFile(data.tunnel.pid ?? 0);

      index++;
    }
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(error.message);
    }
  }
}

void run();
