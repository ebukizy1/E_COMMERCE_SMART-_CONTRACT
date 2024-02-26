import { ethers } from "hardhat";

async function main() {


    // const EShopping = "0xa7f050c6538b1Fd873EDc1a4d1a346A3a7bc258d";
    // const EmaxToken = "0x5911bE72f6DF33665b692E8b82393235037EaE5c";

    const Eshopping = "0xFba1ac34cfD26dB3e5C9F91e830181Fbe7517Fee";


    const productTitle = "I PHONE 6";
    const productDescri = "MY GOOD DURABLE PHONE";
    const productAmount = 6000;
    const productImage = "urls";
    const category = 0;
    const productStatus = 0;

   
    const eshoppingInstance = await ethers.getContractAt("IShopping", Eshopping);

    const createTx = await eshoppingInstance.createProduct(productTitle, productDescri, productImage, productStatus, category, productAmount);
    await createTx.wait();

    const projectList = await eshoppingInstance.getProductList();
    console.log("THIS IS THE PROJECT LIST", projectList);    
    const projectDetails = await eshoppingInstance.getProductDetails(1);
    console.log("THIS IS THE PROJECT DETAILS", projectDetails);    





}


// THIS IS PRODUCT TOKEN  0xa7f050c6538b1Fd873EDc1a4d1a346A3a7bc258d
// THIS IS EMAX TOKEN  0x5911bE72f6DF33665b692E8b82393235037EaE5c

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});