// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

interface IProduct {
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