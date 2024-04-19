const { ethers, upgrades } = require("hardhat");

async function main() {

    const [deployer] = await ethers.getSigners();
    console.log("The account deploy (owner):", deployer.address);

    console.log("Deploying ...");
    // Deploy [CoconutBridge] contract
    const CoconutBridge = await ethers.getContractFactory("CoconutBridge");
    const coconutBridge = await CoconutBridge.deploy();

    console.log("[CoconutBridge] contract deployed to:", coconutBridge.target);
    const ownerBalance = await coconutBridge.balanceOf(deployer.address);
    console.log(`[CoconutBridge] balance of owner (${deployer.address}) : `, ownerBalance);

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