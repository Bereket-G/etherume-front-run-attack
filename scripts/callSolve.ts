import { ethers } from "hardhat";

const {
    FRONT_RUN_CONTRACT_ADDRESS
} = process.env;

async function main() {
  // We get the contract to deploy
  const FrontRun = await ethers.getContractFactory("FrontRun");

  const frontRun = FrontRun.attach(FRONT_RUN_CONTRACT_ADDRESS!);

  const revealTx = await frontRun.solve("Ethereum");

  console.info('revealTx', revealTx);

  await revealTx.wait();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
