import { ethers } from "hardhat";

async function main() {

  // We get the contract to deploy
  const FrontRun = await ethers.getContractFactory("FrontRun");
  const frontRun = await FrontRun.deploy({value: 1_000_000_000_000_000})

  await frontRun.deployed();

  console.log("Front run deployed to:", frontRun.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
