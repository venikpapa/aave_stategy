const { ethers } = require("hardhat");
const fs = require("fs");
let addresses = JSON.parse(fs.readFileSync('./addresses.json'));

module.exports = async ({getNamedAccounts, deployments}) => {
    const {deploy} = deployments;
    const {deployer} = await getNamedAccounts();

    await deploy('StrategyAave', {
        from: deployer,
        args: [],
        log: true,
    });
    console.log("Deploy StrategyAave done");

    const strategyAave = await ethers.getContract("StrategyAave");

    let tx =await strategyAave.setTokens(addresses.usdc_address, addresses.aUsdc_address, {
      maxFeePerGas: "250000000000",
      maxPriorityFeePerGas: "250000000000"
    });
  
    await tx.wait();
    
    let tx2 = await strategyAave.setParams(addresses.aave_address, {
      maxFeePerGas: "250000000000",
      maxPriorityFeePerGas: "250000000000"
    });
    await tx2.wait();
    
    console.log("aave setting done");
};

module.exports.tags = ['test', 'aavest'];