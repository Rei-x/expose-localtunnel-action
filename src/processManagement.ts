import fs from "fs";

const pidsFile = "/tmp/tunnels/localtunnel-pids.json";

export const getSavedPIDs = (): number[] => {
  if (!fs.existsSync(pidsFile)) {
    return [];
  }

  const pids = fs.readFileSync(pidsFile, "utf8");

  return JSON.parse(pids);
};

export const savePIDToFile = (pid: number) => {
  const pids = getSavedPIDs();
  pids.push(pid);
  fs.writeFileSync(pidsFile, JSON.stringify(pids));
};

export const killSavedPIDs = () => {
  const pids = getSavedPIDs();
  pids.forEach(pid => {
    try {
      process.kill(pid, "SIGTERM");
      console.log(`Killed process ${pid}`);
    } catch (e) {
      console.log(`Failed to kill process ${pid}: ${e as string}`);
    }
  });

  if (fs.existsSync(pidsFile)) {
    fs.unlinkSync(pidsFile);
  }
};
