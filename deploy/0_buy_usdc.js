const { ethers } = require("hardhat");
let { addresses1 } = require('../hardhat.config')
const fs = require("fs");
let addresses = JSON.parse(fs.readFileSync('./addresses.json'));

module.exports = async ({
    getNamedAccounts, 
    deployments,
    getChainId
}) => {
    const {deploy, log} = deployments;
    const {deployer} = await getNamedAccounts();
    await deploy('BuyonSwap', {
        from: deployer,
        args: [],
        log: true,
    });
    console.log("Deploy BuyonSwap done");

    let value = "50000000000000000000";

    const buyonSwap = await ethers.getContract("BuyonSwap");
    await buyonSwap.buy(addresses.usdc_address, addresses.uniswapRouter_address, {value: value});
    console.log('Buy usdc: ' + value);
};

module.exports.tags = ['test', 'BuyUsdc'];