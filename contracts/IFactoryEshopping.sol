// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

interface IFactoryEshopping {

     function createEShoppingSystem(address _addres) external;

     function getProductList() external view returns (address [] memory);
    
}