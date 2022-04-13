const { expect } = require("chai");
const {deployments} = require('hardhat');
const chai = require('chai')
const fs = require("fs");
let addresses = JSON.parse(fs.readFileSync('./addresses.json'));

function greatLess(balance, value, delta, msg) {
  expect(balance).to.greaterThanOrEqual(value - delta, msg);
  expect(balance).to.lessThanOrEqual(value + delta, msg);
}

describe("StrategyAave testing", function () {

  toUSDC = (value) => value * 10 ** 6;
  fromUSDC = (value) => value / 10 ** 6;
  fromE6 = (value) => value / 10 ** 6;

  let account;
  let strategy;
  let usdc;
  let amUsdc;

  before(async () => {
    await hre.run("compile");
    await deployments.fixture(['BuyUsdc', 'aavest']);
    const {deployer} = await getNamedAccounts();
    account = deployer;

    strategy = await ethers.getContract('StrategyAave');

    usdc = await ethers.getContractAt("ERC20", addresses.usdc_address);
    ausdc = await ethers.getContractAt("ERC20", addresses.aUsdc_address);
  });

  describe("Stake 10 USDC", function () {

    before(async () => {
      let balanceUsdcBefore = await usdc.balanceOf(account);
      let balanceAUsdcBefore = await ausdc.balanceOf(strategy.address);

      await usdc.transfer(strategy.address, toUSDC(10));
      await strategy.stake(usdc.address, toUSDC(10));
    
      let balanceUsdcAfter = await usdc.balanceOf(account);
      let balanceAUsdcAfter = await ausdc.balanceOf(strategy.address);

      balanceUsdc = fromUSDC(balanceUsdcBefore - balanceUsdcAfter);
      balanceAUsdc = fromE6(balanceAUsdcAfter - balanceAUsdcBefore);

      console.log("balanceUsdcBefore: " + fromUSDC(balanceUsdcBefore));
      console.log("balanceUsdcBefore: " + fromUSDC(balanceUsdcBefore));
      console.log("balanceUsdcAfter: " + fromUSDC(balanceUsdcAfter));
      console.log("balanceUsdc: " + balanceUsdc);
      console.log("balanceAUsdcBefore: " + fromE6(balanceAUsdcBefore));
      console.log("balanceAUsdcAfter: " + fromE6(balanceAUsdcAfter));
      console.log("balanceAUsdc: " + balanceAUsdc);
    });

    it("Balance USDC should be greater than 9 less than 11", async function () {
      greatLess(balanceUsdc, 10, 1);
    });

    it("Balance aUsdc should be greater than 9 less than 11", async function () {
      greatLess(balanceAUsdc, 10, 1);
    });

    it("NetAssetValue USDC should be greater than 9 less than 11", async function () {
      greatLess(fromUSDC(await strategy.netAssetValue()), 10, 1);
    });

    it("LiquidationValue USDC should be greater than 9 less than 11", async function () {
      greatLess(fromUSDC(await strategy.liquidationValue()), 10, 1);
    });

    describe("Unstake 6 USDC", function () {

      let balanceUsdc;
      let balanceAUsdc;

      before(async () => {
        let balanceUsdcBefore = await usdc.balanceOf(account);
        let strategyBalanceUsdcBefore = await usdc.balanceOf(strategy.address);
        let balanceAUsdcBefore = await ausdc.balanceOf(strategy.address);

        await strategy.unstake(usdc.address, toUSDC(6), account, false);

        let balanceUsdcAfter = await usdc.balanceOf(account);
        let strategyBalanceUsdcAfrer = await usdc.balanceOf(strategy.address);
        let balanceAUsdcAfter = await ausdc.balanceOf(strategy.address);

        balanceUsdc = fromUSDC(balanceUsdcAfter - balanceUsdcBefore);
        strategyBalanceUsdc = fromUSDC(strategyBalanceUsdcAfrer - strategyBalanceUsdcBefore);
        balanceAUsdc = fromE6(balanceAUsdcBefore - balanceAUsdcAfter);

        console.log("balanceUsdcBefore: " + fromUSDC(balanceUsdcBefore));
        console.log("balanceUsdcAfter: " + fromUSDC(balanceUsdcAfter));
        console.log("balanceUsdc: " + balanceUsdc);
        console.log("balanceAUsdcBefore: " + fromE6(balanceAUsdcBefore));
        console.log("balanceAUsdcAfter: " + fromE6(balanceAUsdcAfter));
        console.log("balanceAUsdc: " + balanceAUsdc);
        console.log("strategyBalanceUsdcBefore: " + fromE6(strategyBalanceUsdcBefore));
        console.log("strategyBalanceUsdcAfter: " + fromE6(strategyBalanceUsdcAfrer));
        console.log("strategyBalanceUsdc: " + strategyBalanceUsdc);
      });

      it("Balance USDC should be greater than 5 less than 7", async function () {
        greatLess(strategyBalanceUsdc, 6, 1);
      });

      it("Balance aUsdc should be greater than 5 less than 7", async function () {
        greatLess(balanceAUsdc, 6, 1);
      });

      it("NetAssetValue USDC should be greater than 3 less than 5", async function () {
        greatLess(fromUSDC(await strategy.netAssetValue()), 4, 1);
      });

      it("LiquidationValue USDC should be greater than 3 less than 5", async function () {
        greatLess(fromUSDC(await strategy.liquidationValue()), 4, 1);
      });

      describe("Unstake Full", function () {

        let balanceUSDC;
        let balanceAUsdc;

        before(async () => {

            let balanceUsdcBefore = await usdc.balanceOf(account);
            let strategyBalanceUsdcBefore = await usdc.balanceOf(strategy.address);
            let balanceAUsdcBefore = await ausdc.balanceOf(strategy.address);

            await strategy.unstake(usdc.address, 0, account, true);

            let balanceUsdcAfter = await usdc.balanceOf(account);
            let strategyBalanceUsdcAfrer = await usdc.balanceOf(strategy.address);
            let balanceAUsdcAfter = await ausdc.balanceOf(strategy.address);

            balanceUsdc = fromUSDC(balanceUsdcAfter - balanceUsdcBefore);
            strategyBalanceUsdc = fromUSDC(strategyBalanceUsdcAfrer - strategyBalanceUsdcBefore);
            balanceAUsdc = fromE6(balanceAUsdcBefore - balanceAUsdcAfter);

            console.log("balanceUsdcBefore: " + fromUSDC(balanceUsdcBefore));
            console.log("balanceUsdcAfter: " + fromUSDC(balanceUsdcAfter));
            console.log("balanceUsdc: " + balanceUsdc);
            console.log("balanceAUsdcBefore: " + fromE6(balanceAUsdcBefore));
            console.log("balanceAUsdcAfter: " + fromE6(balanceAUsdcAfter));
            console.log("balanceAUsdc: " + balanceAUsdc);
            console.log("strategyBalanceUsdcBefore: " + fromE6(strategyBalanceUsdcBefore));
            console.log("strategyBalanceUsdcAfter: " + fromE6(strategyBalanceUsdcAfrer));
            console.log("strategyBalanceUsdc: " + strategyBalanceUsdc);
        });

        it("Balance USDC should be greater than 3 less than 5", async function () {
            greatLess(strategyBalanceUsdc, 4, 1);
        });

        it("Balance aUsdc should be greater than 3 less than 5", async function () {
            greatLess(balanceAUsdc, 4, 1);
        });

        it("NetAssetValue USDC should be greater than 0 less than 1", async function () {
            greatLess(fromUSDC(await strategy.netAssetValue()), 0.5, 0.5);
        });

        it("LiquidationValue USDC should be greater than 0 less than 1", async function () {
            greatLess(fromUSDC(await strategy.liquidationValue()), 0.5, 0.5);
        });

      });

    });
  });
});
