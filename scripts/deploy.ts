import { ethers } from "hardhat";

async function main() {


  const FactoryContract = await ethers.deployContract("ProductContractFactory");
  await FactoryContract.waitForDeployment();


  console.log(`Factory address of the contract ${FactoryContract.target}`);
  }


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

//Factory address of the contract 0x33fEE46438252fE4b214E6EE7fBfb56e52629260


main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
