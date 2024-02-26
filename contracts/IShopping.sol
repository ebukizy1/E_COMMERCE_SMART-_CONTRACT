// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;
interface IShopping{


    function approve(address spender, uint256 value) external returns (bool);
      function createProduct(
        string memory _productName,
        string memory _productDescription,
        string memory _productImage,
        ProductStatus _productStatus,
        ProductType _productType,
        uint _productAmount

    ) external;

    function upDateProduct(
        uint _productId,
        string memory _productName,
        string memory _productDescription,
        string memory _productImage,
        ProductStatus _productStatus,
        uint _amount
    ) external;

   function getProductDetails(
        uint _productId
    ) external view returns (Product memory);

    function getProductList() external view returns (Product[] memory);

    function checkContractBalance() external view returns(uint);

    function checkStoreBalance(address _addres) external view returns(uint);

    function purchaseProduct(uint _productId, uint _amount) external;

        enum ProductType {
        Electronic,
        Accessories,
        Electrical,
        Gadget
    }

    enum ProductStatus {
        Open,
        Closed
    }

        struct Product {
        uint id;
        string productName;
        string productDescription;
        ProductType productType;
        string productImage;
        ProductStatus productStatus;
        uint productAmount;
    }


}