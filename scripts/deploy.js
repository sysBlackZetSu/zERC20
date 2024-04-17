const { ethers, upgrades } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log("The account deploy (owner):", deployer.address);

    console.log("Deploying ...");
    // Deploy [CoconutBridge] contract
    const CoconutBridge = await ethers.getContractFactory("CoconutBridge");
    const coconutBridge = await CoconutBridge.deploy();

    console.log("[CoconutBridge] contract deployed to:", coconutBridge.target);

    // Deploy [BurnPool] contract
    const BurnPool = await ethers.getContractFactory("BurnPool");
    const burnPool = await BurnPool.deploy(coconutBridge.target);
    console.log("[BurnPool] contract deployed to:", burnPool.target);

    // Deploy [DistributeToken] contract

    const DistributeToken = await ethers.getContractFactory("DistributeToken");
    const distributeToken = await DistributeToken.deploy(coconutBridge.target);
    console.log("[DistributeToken] contract deployed to:", distributeToken.target);

    // Deploy [RewardPool] contract
    const RewardPool = await ethers.getContractFactory("RewardPool");
    const rewardPool = await RewardPool.deploy(coconutBridge.target);
    console.log("[RewardPool] contract deployed to:", rewardPool.target);

    // Deploy [CoconutBridgeStaking] contract
    const CoconutBridgeStaking = await ethers.getContractFactory("CoconutBridgeStaking");
    const startBlock = 0;
    const coconutBridgeStaking = await CoconutBridgeStaking.deploy(startBlock);
    console.log("[CoconutBridgeStaking] contract deployed to:", coconutBridgeStaking.target);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });