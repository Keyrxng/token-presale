// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

contract DemoPresale {

    User[] users;
    address[] whitelist;
    Activity[] activities;
    Pending[] pendingTokens;

    struct User{
        address who;
        string codeName;
    }
    
    struct Activity{
        address who;
        uint amount;
        uint priceOfToken;
        uint time;
        uint indexOfPeriod;
        string status;
    }

    struct Pending{
        address who;
        uint amount;
    }

    function addUser(address _who, string calldata _name) external returns (bool) {
        for(uint x=0;x<users.length;x++){
            if(msg.sender == users[x].who){
                users[x] = User(_who, _name);
                return true;
            }
        }
        users.push(User(_who, _name));
        return true;
    }

    function getUser(address _who) public view returns(User memory){
        User memory user;
        for(uint x=0;x<users.length;x++){
            if(users[x].who == _who){user = users[x];}
        }
        return user;
    }

    function getUsersList() public view returns(User[] memory){
        uint len = users.length;
        User[] memory users_ = new User[](len);
        for(uint x=0;x<len;x++){
            users_[x] = users[x];
        }
        return users_;
    }

    function addToWhitelist(address _who) external returns(bool){
        whitelist.push(_who);
        return true;
    }

    function getWhitelist() public view returns(address[] memory) {
        address[] memory whitelist_ = new address[](whitelist.length);
        for(uint x=0;x<whitelist.length;x++){
            whitelist_[x] = whitelist[x];
        }
        return whitelist_;
    }

    function removeFromWhitelist(address _who) external returns(bool){
        for(uint x=0;x<whitelist.length;x++){
            if(whitelist[x] == _who){
                delete whitelist[x];
                return true;
            }
        }
        return false;
    }

    function checkWhitelist(address _who) external view returns(bool){
        for(uint x=0;x<whitelist.length;x++){
            if(_who == whitelist[x]) return true;
        }
        return false;
    }

    function addActivity(address _who, uint256 _amount, uint256 _price, uint256 _time, uint256 _id, string memory _status) external returns(bool){
        activities.push(Activity(_who, _amount, _price, _time, _id, _status));
        return true;
    }

    function getActivites() public view returns(Activity[] memory){
        uint len = activities.length;
        Activity[] memory activities_ = new Activity[](len);
        for(uint x=0;x<activities.length;x++){
            activities_[x] = activities[x];
        }
        return activities_;
    }

    function getPendingTokens() public view returns (Pending[] memory) {
        uint len = pendingTokens.length;
        Pending[] memory pending_ = new Pending[](len);
        for(uint x=0;x<len;x++){
            pending_[x] = pendingTokens[x];
        }
        return pending_;
    }

    function deletePending(address _who) external returns(bool){
        uint len = pendingTokens.length;
        for(uint x=0;x<len;x++){
            if(_who == pendingTokens[x].who){
                delete pendingTokens[x];
            }
        }
        return true;
    }

    function updatePending(address _who, uint _amount) external returns(bool){
        uint len = pendingTokens.length;
        for(uint x=0;x<len;x++){
            if(_who == pendingTokens[x].who){
                pendingTokens[x].amount += _amount;
                return true;
            }
        }
        Pending memory pending_ = Pending(_who, _amount);
        pendingTokens.push(pending_);
        return true;
    }
    
}