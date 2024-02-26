import { ethers } from "hardhat";


async function main() {
    const EmaxToken = await ethers.deployContract("EmaxToken");
    await EmaxToken.waitForDeployment();

    const factoryEshopAddress = "0x25934049c4378E4FE9D56091b250d1154d408900";


    const EShopping = await ethers.getContractAt("IFactoryEshopping",factoryEshopAddress);
  
    const createEshoppingTx = await EShopping.createEShoppingSystem(EmaxToken.target);
    await  createEshoppingTx.wait();
  
    const productList = await EShopping.getProductList();
   
    console.log(productList);
  
  
   
  
   
  //Factory address of the contract 0x25934049c4378E4FE9D56091b250d1154d408900


}

main().catch((error) => {
console.error(error);
process.exitCode = 1;
});
