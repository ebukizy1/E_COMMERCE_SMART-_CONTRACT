// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
import "./ECommerce.sol";

contract ProductContractFactory {
    address[] productList;


    event ProductContractSuccessful(address indexed voteAddress, address indexed creator);


    function createEShoppingSystem(address _addres) external {
        ProductContract newProduct = new ProductContract(_addres);
        productList.push(address(newProduct));
        emit ProductContractSuccessful(address(newProduct), msg.sender);
    }

    function getProductList() external view returns (address [] memory) {
        return productList;
    }
}
