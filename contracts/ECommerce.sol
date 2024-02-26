// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

import "./IProduct.sol";
import "./ErrorMessage.sol";
import "./IERC20.sol";

contract ProductContract is IProduct {
    using ErrorMessage for *;
    address public emaxToken;
    address private owner;


    mapping(uint => Product) private productMap;
    mapping(address => uint) private storeBalance;
    mapping(address => Product[]) private purchasedProducts;
    Product[] private productList;
    Product[] private purchasedProductList;
    uint productId;

    

    constructor(address _tokenAddress){
        emaxToken = _tokenAddress;
     
    }
    


    function createProduct(
        string memory _productName,
        string memory _productDescription,
        string memory _productImage,
        ProductStatus _productStatus,
        ProductType _productType,
        uint _productAmount

    ) external {
        require(_productAmount > 0, "invalid product amount");
    

        uint idProduct = productId + 1;
        Product storage _newProduct = productMap[idProduct];
        _newProduct.id = idProduct;
        _newProduct.productName = _productName;
        _newProduct.productDescription = _productDescription;
        _newProduct.productImage = _productImage;

        _newProduct.productStatus = _productStatus;
        _newProduct.productType = _productType;
        _newProduct.productAmount = _productAmount;

        productList.push(_newProduct);
        productId = productId + 1;
    }

    function upDateProduct(
        uint _productId,
        string memory _productName,
        string memory _productDescription,
        string memory _productImage,
        ProductStatus _productStatus,
        uint _amount
    ) external {
      
        VALIDATE_PRODUCT_ID(_productId);

         VALIDATE_PRODUCTLIST(_productId);

        Product storage foundProduct = productMap[_productId];
        foundProduct.productName = _productName;
        foundProduct.productDescription = _productDescription;
        foundProduct.productStatus = _productStatus;
        foundProduct.productImage = _productImage;
        foundProduct.productAmount = _amount;
        updateProductInArray(foundProduct);
    }


    function updateProductInArray(Product storage updatedProduct) private {
        for (uint i = 0; i < productList.length; i++) {
            if (productList[i].id == updatedProduct.id) {
                productList[i] = updatedProduct;
                break;
            }
        }
    }

    function getProductDetails(
        uint _productId
    ) external view returns (Product memory) {
       VALIDATE_PRODUCTLIST(productId);
        VALIDATE_PRODUCT_ID(productId);

        return productMap[_productId];
    }



    function getProductList() external view returns (Product[] memory) {
        return productList;
    }


    function purchaseProduct(uint _productId, uint _amount) external {
        VALIDATE_PRODUCT_ID(_productId);

        if(msg.sender == address(0)){
            revert ErrorMessage.ZERO_ADDRESS_ERROR();
        }

        if(IERC20(emaxToken).balanceOf(msg.sender) < _amount){
            revert ErrorMessage.INSUFFICIENT_FUNDS();
        }

         Product storage _foundProduct = productMap[_productId];
         require(_foundProduct.productAmount == _amount, "invalid amount for product");

        IERC20(emaxToken).transferFrom(msg.sender, address(this), _amount);

        storeBalance[msg.sender] += _amount;
        
        purchasedProducts[msg.sender].push(_foundProduct);
        purchasedProductList.push(_foundProduct);

    }
    function checkContractBalance() external view returns(uint) {
        onlyOwner(msg.sender);
            return IERC20(emaxToken).balanceOf(address(this));
    }

     function checkStoreBalance(address _addres) external view returns(uint) {
       return storeBalance[_addres];
    }


       function VALIDATE_PRODUCT_ID(uint _productId) private view {
        if (productMap[_productId].id == 0) {
            revert ErrorMessage.INVALID_PRODUCT_ID_MAP();
        }
    }

    function VALIDATE_PRODUCTLIST(uint _productId) private view{
        if (_productId < 1 || _productId > productList.length) {
            revert ErrorMessage.INVALID_PRODUCT_ID();
        }
    }

    function getPurchaseProduct() external view returns(Product [] memory){
        return purchasedProductList;
    }

    function onlyOwner(address _owner) private view {
        if(owner != _owner) {
            revert ErrorMessage.YOU_ARE_NOT_THE_OWNER();
        }
    }



}