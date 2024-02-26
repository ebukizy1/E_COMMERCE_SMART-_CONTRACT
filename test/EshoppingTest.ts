import {
  time,
  loadFixture,
} from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { anyValue } from "@nomicfoundation/hardhat-chai-matchers/withArgs";
import { expect ,assert} from "chai";
import { ethers ,} from "hardhat";

describe("EShopping", function () {

  async function deployShoppingCart() {
    const productTitle = "I PHONE 6";
    const productDescri = "MY GOOD DURABLE PHONE";
    const productAmount = 6000;
    const productImage = "urls";
    const category = 0;
    const productStatus = 0;
   
    const EmaxToken = await ethers.getContractFactory("EmaxToken");
    const emaxToken = await EmaxToken.deploy();

    // Contracts are deployed using the first signer/account by default
    const [owner, account1, account2] = await ethers.getSigners();

    const EShopping = await ethers.getContractFactory("ProductContract");
    const  eShopping = await EShopping.deploy(emaxToken.target);

    return { eShopping, emaxToken, productAmount, owner,
       account1, productDescri, productTitle, productImage, category, productStatus};
  }

  describe("Deployment", function () {

    it("test that product contract can be deploy", async ()=>{
      const { eShopping, emaxToken }
      = await loadFixture(deployShoppingCart);
      expect(await eShopping.emaxToken()).to.equal(emaxToken.target);
      assert.isNotNull(eShopping);
      
    })
describe("Create Product", async()=>{
  it("test that product can be create", async function () {
    const { eShopping,productAmount, productDescri, productTitle, productImage, category, productStatus }
     = await loadFixture(deployShoppingCart);
     
   const createTx =  await 
   eShopping.createProduct(productTitle, productDescri, productImage, category, productStatus, productAmount);
   await createTx.wait();
   const productListTx = await eShopping.getProductList();
  
  expect(productListTx.length).to.equal(1);
  expect(productListTx[0].productName).to.equal(productTitle);
  expect(productListTx[0].productDescription).to.equal(productDescri);
  expect(productListTx[0].productAmount).to.equal(productAmount);

  });

  describe("Create Product Validation", async()=>{

    it("test that product amount cannot be less than zero", async function () {
      const { eShopping,productDescri, productTitle, productImage, category, productStatus}
      = await loadFixture(deployShoppingCart);
    
     await expect(eShopping.createProduct(productTitle, productDescri, productImage, category, productStatus, 0))
     .to.revertedWith("invalid product amount");
    });

    it("test that only owner can create product", async function () {
      const { eShopping,productAmount, productDescri, productTitle, productImage, category, productStatus , account1 }
      = await loadFixture(deployShoppingCart);
    
     await expect(eShopping.connect(account1)
     .createProduct(productTitle, productDescri, productImage, category, productStatus, productAmount))
     .to.revertedWithCustomError(eShopping, "YOU_ARE_NOT_THE_OWNER()");
    });


  });
  describe("Update Prdouct " , async ()=>{
    it("test that product can be updated", async()=>{
      const { eShopping,productAmount, productDescri, productTitle, productImage, category, productStatus , account1 }
      = await loadFixture(deployShoppingCart);
      const productId = 1;
      const newTitle = "new iphone 12";
      const newDescri = "all i need is update";
      const proAmount = 4000;

      //creating new product
      const createTx =  await 
      eShopping.createProduct(productTitle, productDescri, productImage, category, productStatus, productAmount);
      await createTx.wait();
      const productListTx = await eShopping.getProductList();
     
     expect(productListTx.length).to.equal(1);
     expect(productListTx[0].productName).to.equal(productTitle);
     expect(productListTx[0].productDescription).to.equal(productDescri);
     expect(productListTx[0].productAmount).to.equal(productAmount);
   

     //updating the product
      const updateTx =  await 
      eShopping.upDateProduct(productId, newTitle, newDescri, productImage,productStatus, proAmount);
      await updateTx.wait();

      const productList = await eShopping.getProductList();

      expect(productList[0].productName).to.equal(newTitle);
      expect(productList[0].productDescription).to.equal(newDescri);
      expect(productList[0].productAmount).to.equal(proAmount);

      
    });
  });
  describe("Update Product Validation", async()=>{
    it("test that product cannot allow invalid input", async()=>{
      const { eShopping,productImage, productStatus }
      = await loadFixture(deployShoppingCart);

      const productId = 1;
      const newTitle = "new iphone 12";
      const newDescri = "all i need is update";
      const proAmount = 4000;

      await expect(eShopping.upDateProduct(productId, newTitle, newDescri, productImage,productStatus, proAmount))
      .to.be.revertedWithCustomError(eShopping,"INVALID_PRODUCT_ID_MAP()");
    
    });
    it("test only owner can update product", async()=>{

      const { eShopping,productImage, productStatus ,account1}
      = await loadFixture(deployShoppingCart);
      const productId = 1;
      const newTitle = "new iphone 12";
      const newDescri = "all i need is update";
      const proAmount = 4000;

      await expect(eShopping.connect(account1).upDateProduct(productId, newTitle, newDescri, productImage,productStatus, proAmount))
      .to.be.revertedWithCustomError(eShopping, "YOU_ARE_NOT_THE_OWNER()");
      
    });
  });

  describe("Purchase Product", async()=>{
    it("test that user can purchase product", async ()=>{

      const { eShopping,productAmount, productDescri, productTitle, productImage, category, productStatus,emaxToken , owner}
      = await loadFixture(deployShoppingCart);
      
    const createTx =  await 
    eShopping.createProduct(productTitle, productDescri, productImage, category, productStatus, productAmount);
    await createTx.wait();

    const createTx2 =  await 
    eShopping.createProduct(productTitle, productDescri, productImage, category, productStatus, productAmount);
    await createTx2.wait();
    const productListTx = await eShopping.getProductList();
    expect(productListTx.length).to.equal(2);

    //approve the contract to be able to spend token 
    const approveTx = await emaxToken.connect(owner).approve(eShopping.target, 200000);
    await approveTx.wait();

   const purchaseTx = await eShopping.purchaseProduct(1, 6000);
   await  purchaseTx.wait();

   const balanceTx = await eShopping.checkContractBalance();

   expect(balanceTx).to.equal(6000);

   const storeBalTx = await eShopping.checkStoreBalance(owner.address);
   expect(storeBalTx).to.equal(6000);   
    })
  })

})
 

  

  //   it("Should receive and store the funds to lock", async function () {
  //     const { lock, lockedAmount } = await loadFixture(
  //       deployOneYearLockFixture
  //     );

  //     expect(await ethers.provider.getBalance(lock.target)).to.equal(
  //       lockedAmount
  //     );
  //   });

  //   it("Should fail if the unlockTime is not in the future", async function () {
  //     // We don't use the fixture here because we want a different deployment
  //     const latestTime = await time.latest();
  //     const Lock = await ethers.getContractFactory("Lock");
  //     await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
  //       "Unlock time should be in the future"
  //     );
  //   });
  // });

  // describe("Withdrawals", function () {
  //   describe("Validations", function () {
  //     it("Should revert with the right error if called too soon", async function () {
  //       const { lock } = await loadFixture(deployOneYearLockFixture);

  //       await expect(lock.withdraw()).to.be.revertedWith(
  //         "You can't withdraw yet"
  //       );
  //     });

  //     it("Should revert with the right error if called from another account", async function () {
  //       const { lock, unlockTime, otherAccount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // We can increase the time in Hardhat Network
  //       await time.increaseTo(unlockTime);

  //       // We use lock.connect() to send a transaction from another account
  //       await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
  //         "You aren't the owner"
  //       );
  //     });

  //     it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
  //       const { lock, unlockTime } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       // Transactions are sent using the first signer by default
  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).not.to.be.reverted;
  //     });
  //   });

  //   describe("Events", function () {
  //     it("Should emit an event on withdrawals", async function () {
  //       const { lock, unlockTime, lockedAmount } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw())
  //         .to.emit(lock, "Withdrawal")
  //         .withArgs(lockedAmount, anyValue); // We accept any value as `when` arg
  //     });
  //   });

  //   describe("Transfers", function () {
  //     it("Should transfer the funds to the owner", async function () {
  //       const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
  //         deployOneYearLockFixture
  //       );

  //       await time.increaseTo(unlockTime);

  //       await expect(lock.withdraw()).to.changeEtherBalances(
  //         [owner, lock],
  //         [lockedAmount, -lockedAmount]
  //       );
  //     });
  //   });
  // });
});
});
