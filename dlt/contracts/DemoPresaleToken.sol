// SPDX-License-Identifier: MIT
pragma solidity 8.0.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract DemoPresaleToken is ERC20, Ownable {

    uint public id;
    uint public pendingCount;
    uint _decimals = 10**decimals();
    uint public price;
    uint public totalPurchased;
    uint public hardcap;
    bool public activePeriod;

    mapping(address => uint) public contributors;
    mapping(address => uint) public funds;
    mapping(uint => Period) public periods;
    mapping(address => mapping(uint => bool)) public userDetails; // userDetails[_who][purchasedAmount] = true (if has reached limit)

    Purchased[] purchasedTokens;

    struct Period {
        uint startTime;
        uint endTime;
        uint price;
        uint amount;
        uint remaining;
        uint hardcap;
        bool active;
    }

    struct Purchased {
        address who;
        uint amount;
        uint price;
        uint time;
    }
}