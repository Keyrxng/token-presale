// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import DemoPresale from "./DemoPresale.sol";

contract DemoPresaleToken is ERC20, Ownable {

    DemoPresale presale;

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

    constructor(string memory _name, string memory _symbol, address _presale) ERC20(_name, _symbol) {
        presale = DemoPresale(_presale);
        _mint(address(this), 10e13 * decimals); // 100 Trillion
        address marketing = 0x1337133713371337133713371337133713371337;
        address staking = 0x1337133713371337133713371337133713371337;
        address team = 0x1337133713371337133713371337133713371337;
        address airdorp = 0x1337133713371337133713371337133713371337;
        _transfer(address(this), marketing, 13e12 * _decimals); // 13 trillion
        _transfer(address(this), staking, 5e12 * _decimals); // 5 trillion
        _transfer(address(this), team, 18e12 * _decimals); // 18 trillion
        _transfer(address(this), airdrop, 24e12 * _decimals); // 24 trillion
        // this address holds all other tokens (40 Trillion)
    }

    function requestToken(uint _amount, uint _num) payable public {
        _amount = _amount * _decimals / 10 ** _num;
        totalPurchased += _amount;
        contributors[msg.sender] += _amount;
        funds[msg.sender] += msg.value;
        periods[id].remaining = periods[id].remaining - _amount;
        updatePending(msg.sender, _amount);
        presale.addActivity(msg.sender, _amount, price, block.timestamp, id, "Request Tokens");
        pendingCount++;
    }

    function approveToken(address _who) public onlyOwner returns (bool){
        require(contributors[_who] > 0, "this address doesn't have any pending tokens");
        _transfer(address(this)_spender, contributors[_who]);

        payable(owner()).transfer(funds[_who]);
        deletePending(_who);

        purchasedTokens.push(Purchased(_who, contributors[_who], price, block.timestamp));
        presale.addActivity(_who, contributors[_who], price, block.timestamp, id, "Approved");
        contributors[_who] = funds[_who] = 0;
        pendingCount--;
        return true;
    }

    function unapproveToken(address _who) public returns(bool) {
        require(contributors[_who] > 0< "This address doesn;t have any pending tokens");
        payable(_who).transfer(funds[_who]);
        periods[id].remaining = periods[id].remaining + contributors[_who]
    }
}