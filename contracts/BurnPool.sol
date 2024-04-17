// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CoconutBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract BurnPool is Ownable {
    string public name = "CoconutBridge: BurnPool";

    CoconutBridge private coconutBridge;

    constructor(CoconutBridge _coconutBridge) Ownable(msg.sender) {
        coconutBridge = _coconutBridge;
    }

    function tokenBalance() public view returns (uint256) {
        return coconutBridge.balanceOf(address(this));
    }

    function burnAllToken() public onlyOwner {
        coconutBridge.burn(tokenBalance());
    }

    function burnToken(uint256 amount) public onlyOwner {
        coconutBridge.burn(amount);
    }

    function depositETHtoContract() public payable {}

    function withdrawFund() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "not enough fund");
        payable(owner()).transfer(balance);
    }
}
