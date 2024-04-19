const { expect } = require("chai");
const { loadFixture } = require('@nomicfoundation/hardhat-network-helpers');

const name = 'CoconutBridge';
const symbol = 'COB';
const initialSupply = 100n;

describe("Token CoconutBridge", function () {
    it("Token", function() {

    });

    it("Deployment should assign the total supply of tokens to the owner", async function () {
        const [owner] = await ethers.getSigners();
        const hardhatToken = await ethers.deployContract("CoconutBridge");

        const ownerBalance = await hardhatToken.balanceOf(owner.address);
        expect(ownerBalance).to.equal(100000000 / 4);
    });

    it("Should transfer tokens between onwer and orther", async function () {
        // Transfer 50 tokens from owner to ["0x70997970C51812dc3A010C7d01b50e0d17dc79C8"]
        const hardhatToken = await ethers.deployContract("CoconutBridge");
        const to = "0x70997970C51812dc3A010C7d01b50e0d17dc79C8";
        const amount = 1000;

        await hardhatToken.transfer(to, amount);
        expect(await hardhatToken.balanceOf(to)).to.equal(amount);expect(await hardhatToken.balanceOf(to)).to.equal(amount);
    });

    it("Should transfer tokens between accounts", async function () {

        const hardhatToken = await ethers.deployContract("CoconutBridge");
        const privateKey = "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d";
        const signer = new ethers.Wallet(privateKey, ethers.provider);

        // send token to wallet
        await hardhatToken.transfer(signer.address, 1000);

        // send token
        const to = "0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC";
        const amount = 100;
        const fromBeforeBalance = await hardhatToken.balanceOf(signer.address);

        await hardhatToken.connect(signer).transfer(to, amount);
        expect(await hardhatToken.balanceOf(to)).to.equal(amount);

        expect(await hardhatToken.balanceOf(signer.address)).to.equal(BigInt(fromBeforeBalance) - BigInt(amount));
    });

    it("Should mint token by owner", async function () {
        const hardhatToken = await ethers.deployContract("CoconutBridge");
        const to = "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65";

        await hardhatToken.mint(to, 125);
        expect(await hardhatToken.balanceOf(to)).to.equal(125);
    });
});

