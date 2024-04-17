// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./CoconutBridge.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RewardPool is Ownable {
    string public name = "CoconutBridge: RewardPool";

    CoconutBridge private coconutBridge;

    constructor(CoconutBridge _coconutBridge) Ownable(msg.sender) {
        coconutBridge = _coconutBridge;
    }

    function tokenBalance() public view returns (uint256) {
        return coconutBridge.balanceOf(address(this));
    }

    ///withdraw token to pool reward
    function withdrawToken(
        address poolAddress,
        uint256 amount
    ) public onlyOwner {
        require(amount > 0, "RewardPool: not enough balance");
        require(amount <= tokenBalance(), "RewardPool: not enough balance");
        require(
            poolAddress != address(0),
            "RewardPool: transfer to the zero address"
        );

        coconutBridge.transfer(poolAddress, amount);
    }

    function depositETHtoContract() public payable {}

    function withdrawFund() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "not enough fund");
        payable(owner()).transfer(balance);
    }
}
