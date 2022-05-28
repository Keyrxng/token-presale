// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";
import {DemoPresale} from "./DemoPresale.sol";

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
        _mint(address(this), 10e13 * _decimals); // 100 Trillion
        address marketing = 0x1337133713371337133713371337133713371337;
        address staking = 0x1337133713371337133713371337133713371337;
        address team = 0x1337133713371337133713371337133713371337;
        address airdrop = 0x1337133713371337133713371337133713371337;
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
        _transfer(address(this), _who, contributors[_who]);

        payable(owner()).transfer(funds[_who]);
        deletePending(_who);

        purchasedTokens.push(Purchased(_who, contributors[_who], price, block.timestamp));
        presale.addActivity(_who, contributors[_who], price, block.timestamp, id, "Approved");
        contributors[_who] = funds[_who] = 0;
        pendingCount--;
        return true;
    }

    function unapproveToken(address _who) public returns(bool) {
        require(contributors[_who] > 0, "This address doesn't have any pending tokens");
        payable(_who).transfer(funds[_who]);
        periods[id].remaining = periods[id].remaining + contributors[_who];
        totalPurchased -= contributors[_who];
        deletePending(_who);
        presale.addActivity(_who, contributors[_who], price, block.timestamp, id, "Unapproved");
        contributors[_who] = funds[_who] = 0;
        pendingCount--;
        return true;
    }

    function getPurchasedtokens(address _who) public view returns(Purchased[] memory) {
        uint len = purchasedTokens.length;
        Purchased[] memory purchased_ = new Purchased[](len);
        for(uint x=0;x<len;x++){
            if(purchasedTokens[x].who == _who){
                purchased_[x] = purchasedTokens[x];
            }
        }
        return purchased_;
    }

    function getMinTokens() public view returns (uint) {
        if(_decimals > price) return _decimals / price;
        return 1;
    }

    function getPeriods() public view returns(Period[] memory){
        Period[] memory periods_ = new Period[](id);
        for(uint x=0;x<id;x++){
            periods_[x] = periods[x+1];
        }
        return periods_;
    }

    function getActivePeriod() public view returns(Period memory){
        Period memory period_ = periods[id];
        return period_;
    }

    function deactivatePeriod() public onlyOwner returns(bool){
        if(pendingCount > 0) return false;
        periods[id].active = false;
        activePeriod = false;
        return true;
    }

    function addUser(address _who, string calldata _name) public returns(bool){
        presale.addUser(_who, _name);
        return true;
    }

    function addToWhitelist(address _who) public onlyOwner returns(bool){
        require(!presale.checkWhitelist(_who), "This address already exists");
        require(_who != address(0), "Unknown address");
        presale.addToWhitelist(_who);
        presale.addActivity(_who, 0, 0, block.timestamp, id, "Added to whitelist");
        return true;
    }

    function removeFromWhitelist(address _who) public returns(bool){
        if(presale.removeFromWhitelist(_who)) {
            presale.addActivity(_who, 0, 0, block.timestamp, id, "Removed from whitelist");
            return true;
        }
        return false;
    }

    function deletePending(address _who) internal returns(bool){
        return presale.deletePending(_who);
    }

    function updatePending(address _who, uint _amount) internal returns(bool){
        return presale.updatePending(_who, _amount);
    }

    function prevalidateMint(uint _start, uint _end, uint _amount, uint _hardcap) internal view{
        require(_start < _end && _end > block.timestamp, "start and end time error");
        require(_amount <= totalSupply() && _amount > 0, "The amount of tokens must be greater than 0 and less than total supply");
        require(_amount < (totalSupply() - totalPurchased), "No more available tokens for this amount");
        require(pendingCount == 0, "There are token requests pending");
        require(_hardcap >= hardcap, "Hardcap figure must be equal to or more than the previous round");
    }

    function initialMint(uint _start, uint _end, uint _amount, uint _price, uint _hardcap) internal returns(bool){
        if(id >0) periods[id].active = false;
        price = _price;
        hardcap = _hardcap;
        id++;
        periods[id] = Period(_start, _end, _price, _amount, _amount, _hardcap, true);
        return activePeriod = true;
    }

    function value(uint _amount) internal view returns (uint){
        if(_decimals > price) {
            return _amount / (_decimals / price);
        }
        return price / _decimals * _amount;
    }

    fallback () external payable {}
    receive () external payable {}
}