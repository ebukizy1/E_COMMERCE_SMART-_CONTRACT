// SPDX-License-Identifier: SEE LICENSE IN LICENSE
pragma solidity ^0.8.9;

library Events {
    event SwapSuccessful(
        address indexed _sender,
        address indexed recipent,
        uint _tokenAmount
    );
}