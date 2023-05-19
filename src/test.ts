import { execSync } from "child_process";

const getBranchName = () => {
  const branchName = execSync("git branch --show-current");

  return branchName.toString().trim();
};

const run = () => {
  const currentBranchName = getBranchName();

  console.log(currentBranchName);
};

run();
