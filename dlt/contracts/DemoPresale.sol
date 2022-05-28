// SPDX-License-Identifier: MIT
pragma solidity 8.0.0;

contract DemoPresale {

    User[] users;
    address[] whitelist;
    Activity[] activities;
    Pending[] pendingtokens;

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
            if(msg.sender == users[x]._who){
                users[x] = User(_who, _name);
                return true;
            }
        }
        users.push(User(_who, _name));
        return true;
    }

    function getUser(address _who) public view returns(User memory){
        User memory user;
        for(uint x=0;x<user.length;x++){
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
}