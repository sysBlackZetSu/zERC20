// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DistributeToken is Ownable {
    string public name = "CoconutBridge: Distribute Token";

    using SafeERC20 for IERC20;
    IERC20 token;

    constructor(IERC20 _tokenAddress) Ownable(msg.sender) {
        token = _tokenAddress;
    }

    function changeTokenContract(IERC20 tokenContract) public onlyOwner {
        token = tokenContract;
    }

    function distributeToken(
        address[] memory listUser,
        uint256[] memory listAmount
    ) public onlyOwner {
        for (uint256 i = 0; i < listUser.length; i++) {
            token.transfer(listUser[i], listAmount[i]);
        }
    }

    function distributeToken(
        address[] memory listUser,
        uint256 amount
    ) public onlyOwner {
        for (uint256 i = 0; i < listUser.length; i++) {
            token.transfer(listUser[i], amount);
        }
    }

    // Rút token về ví owner
    function withdrawToken() public {
        token.transfer(owner(), token.balanceOf(address(this)));
    }

    receive() external payable {}
}
