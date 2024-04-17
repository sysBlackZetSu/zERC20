// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CoconutBridgeStaking is Ownable {
    string public name = "CoconutBridge: Staking";
    using SafeERC20 for IERC20;

    struct UserInfo {
        uint256 amount;
        uint256 rewardDebt;
        uint256 rewardClaimed;
        uint256 lastBlock;
        uint256 beginTime;
        uint256 endTime;
    }

    // Info of each pool.
    struct PoolInfo {
        IERC20 stakeToken;
        IERC20 rewardToken;
        uint256 allocPoint;
        uint256 lastRewardBlock;
        uint256 accTokenPerShare;
        uint256 rewardPerBlock;
        uint256 totalTokenStaked;
        uint256 totalTokenClaimed;
        uint256 endDate;
    }

    // Info of each pool.
    PoolInfo[] private poolInfo;

    mapping(uint256 => mapping(address => UserInfo)) public userInfo;
    uint256 public totalUser;

    // The block number when staking  starts.
    uint256 public startBlock;

    event Deposit(address indexed user, uint256 indexed pid, uint256 amount);
    event Withdraw(address indexed user, uint256 indexed pid, uint256 amount);
    event EmergencyWithdraw(
        address indexed user,
        uint256 indexed pid,
        uint256 amount
    );

    constructor(uint256 _startBlock) Ownable(msg.sender) {
        startBlock = _startBlock;
    }

    function poolLength() external view returns (uint256) {
        return poolInfo.length;
    }

    // onwer add POOL
    function addPool(
        uint256 _allocPoint,
        IERC20 _stakeToken,
        IERC20 _rewardToken,
        uint256 _rewardPerBlock,
        uint256 _endDate,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        uint256 _lastRewardBlock = block.number > startBlock
            ? block.number
            : startBlock;

        poolInfo.push(
            PoolInfo({
                stakeToken: _stakeToken,
                rewardToken: _rewardToken,
                allocPoint: _allocPoint,
                lastRewardBlock: _lastRewardBlock,
                accTokenPerShare: 0,
                rewardPerBlock: _rewardPerBlock,
                totalTokenStaked: 0,
                totalTokenClaimed: 0,
                endDate: _endDate
            })
        );
    }

    // owner update POOL
    function setPool(
        uint256 _pid,
        uint256 _allocPoint,
        uint256 _rewardPerBlock,
        uint256 _endDate,
        bool _withUpdate
    ) public onlyOwner {
        if (_withUpdate) {
            massUpdatePools();
        }
        if (_allocPoint > 0) {
            poolInfo[_pid].allocPoint = _allocPoint;
        }
        if (_rewardPerBlock > 0) {
            poolInfo[_pid].rewardPerBlock = _rewardPerBlock;
        }
        if (_endDate > 0) {
            poolInfo[_pid].endDate = _endDate;
        }
    }

    // Return reward multiplier over the given _from to _to block.
    function getMultiplier(
        uint256 _fromBlock,
        uint256 _toBlock
    ) public pure returns (uint256) {
        return _toBlock - _fromBlock;
    }

    // Total token stake trong POOL
    function getTotalTokenStaked(uint256 _pid) public view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        return pool.totalTokenStaked;
    }

    // Tính toán phần thưởng chờ nhận cho một người dùng trong một hồ
    function pendingReward(
        uint256 _pid,
        address _user
    ) external view returns (uint256) {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][_user];
        uint256 accTokenPerShare = pool.accTokenPerShare;
        uint256 totalTokenStaked = getTotalTokenStaked(_pid);

        if (block.number > pool.lastRewardBlock && totalTokenStaked > 0) {
            uint256 multiplier = getMultiplier(
                pool.lastRewardBlock,
                block.number
            );
            uint256 tokenReward = multiplier * pool.rewardPerBlock;
            accTokenPerShare += (tokenReward * 1e18) / totalTokenStaked;
        }

        if (totalTokenStaked == 0 || block.number <= pool.lastRewardBlock) {
            return 0;
        }

        return (user.amount * accTokenPerShare) / 1e18 - user.rewardDebt;
    }

    // Update reward variables for all pools. Be careful of gas spending!
    function massUpdatePools() public {
        uint256 length = poolInfo.length;
        for (uint256 pid = 0; pid < length; ++pid) {
            updatePool(pid);
        }
    }

    // Update reward variables of the given pool to be up-to-date.
    function updatePool(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        if (block.number <= pool.lastRewardBlock) {
            return;
        }
        uint256 totalTokenStaked = getTotalTokenStaked(_pid);

        if (totalTokenStaked == 0 || pool.allocPoint == 0) {
            pool.lastRewardBlock = block.number;
            return;
        }

        uint256 multiplier = getMultiplier(pool.lastRewardBlock, block.number);
        uint256 tokenReward = multiplier * pool.rewardPerBlock;

        pool.accTokenPerShare += (tokenReward * 1e18) / totalTokenStaked;
        pool.lastRewardBlock = block.number;
    }

    // Thêm token vào POOL
    function deposit(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(block.timestamp < pool.endDate, "Staking pool already closed");

        updatePool(_pid);

        if (user.amount > 0) {
            uint256 pending = (user.amount * pool.accTokenPerShare) /
                1e18 -
                user.rewardDebt;
            if (pending > 0) {
                safeTokenTransfer(msg.sender, pending, _pid);
                pool.totalTokenClaimed += pending;
                user.rewardClaimed += pending;
            }
        } else {
            // New user, or old user unstake all before
            totalUser += 1;
            user.beginTime = block.timestamp;
            user.endTime = 0; // Reset endtime
        }

        require(_amount > 0, "Deposit amount must be greater than 0");

        pool.stakeToken.safeTransferFrom(
            address(msg.sender),
            address(this),
            _amount
        );

        user.amount += _amount;
        user.rewardDebt = (user.amount * pool.accTokenPerShare) / 1e18;
        user.lastBlock = block.number;

        emit Deposit(msg.sender, _pid, _amount);
    }

    // Rút token ra khỏi POOL
    function withdraw(uint256 _pid, uint256 _amount) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        require(user.amount >= _amount, "Withdraw: Insufficient balance");

        updatePool(_pid);

        uint256 pending = (user.amount * pool.accTokenPerShare) /
            1e18 -
            user.rewardDebt;
        if (pending > 0) {
            safeTokenTransfer(msg.sender, pending, _pid);
            pool.totalTokenClaimed += pending;
            user.rewardClaimed += pending;
        }

        if (_amount > 0) {
            user.amount -= _amount;
            if (user.amount == 0) {
                user.endTime = block.timestamp;
            }

            pool.totalTokenStaked -= _amount;
            pool.stakeToken.safeTransfer(address(msg.sender), _amount);
        }

        user.rewardDebt = (user.amount * pool.accTokenPerShare) / 1e18;
        user.lastBlock = block.number;

        emit Withdraw(msg.sender, _pid, _amount);
    }

    // Rút token ra khỏi POOL
    function emergencyWithdraw(uint256 _pid) public {
        PoolInfo storage pool = poolInfo[_pid];
        UserInfo storage user = userInfo[_pid][msg.sender];
        uint256 amount = user.amount;
        user.amount = 0;
        user.rewardDebt = 0;
        pool.stakeToken.safeTransfer(address(msg.sender), amount);
        emit EmergencyWithdraw(msg.sender, _pid, amount);
    }

    // chuyển token (hàm nội bộ)
    function safeTokenTransfer(
        address _to,
        uint256 _amount,
        uint256 _pid
    ) internal {
        PoolInfo storage pool = poolInfo[_pid];
        uint256 totalPoolReward = pool.allocPoint;

        if (_amount > totalPoolReward) {
            pool.rewardToken.transfer(_to, totalPoolReward);
        } else {
            pool.rewardToken.transfer(_to, _amount);
        }
    }

    // Thông tin POOL
    function getPoolInfo(
        uint256 _pid
    ) public view returns (uint256, uint256, uint256, uint256, uint256) {
        return (
            poolInfo[_pid].accTokenPerShare,
            poolInfo[_pid].lastRewardBlock,
            poolInfo[_pid].rewardPerBlock,
            poolInfo[_pid].totalTokenStaked,
            poolInfo[_pid].totalTokenClaimed
        );
    }

    function getDiffBlock(
        address _user,
        uint256 _pid
    ) public view returns (uint256) {
        UserInfo storage user = userInfo[_pid][_user];
        require(user.amount > 0, "User not found in this pool");
        return block.number - user.lastBlock;
    }
}
