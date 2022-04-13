// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "./IStrategy.sol";
import "./IPoolAddressesProvider.sol";
import "./IPool.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "hardhat/console.sol";

contract StrategyAave is IStrategy {

    IERC20 public usdcToken;
    IERC20 public aUsdcToken;

    IPoolAddressesProvider public aaveProvider;

    event StrategyAaveUpdatedTokens(address usdcToken, address aUsdcToken);
    event StrategyAaveUpdatedParams(address aaveProvider);

    constructor() {
        
    }

    function setTokens(
        address _usdcToken,
        address _aUsdcToken
    ) external {
        require(_usdcToken != address(0), "Zero address not allowed");
        require(_aUsdcToken != address(0), "Zero address not allowed");
        usdcToken = IERC20(_usdcToken);
        aUsdcToken = IERC20(_aUsdcToken);
        emit StrategyAaveUpdatedTokens(_usdcToken, _aUsdcToken);
    }

    function setParams(
        address _aaveProvider
    ) external {
        require(_aaveProvider != address(0), "Zero address not allowed");
        aaveProvider = IPoolAddressesProvider(_aaveProvider);
        emit StrategyAaveUpdatedParams(_aaveProvider);
    }

    function stake(
        address _asset,
        uint256 _amount
    ) external override {
        require(_asset == address(usdcToken), "Some token not compatible");
        IPool pool = IPool(aaveProvider.getPool());
        usdcToken.approve(address(pool), _amount);
        pool.deposit(address(usdcToken), _amount, address(this), 0);
        emit Stake(_amount);
    }

    function unstake(
        address _asset,
        uint256 _amount,
        address _beneficiary,
        bool targetIsZero
    ) external override returns (uint256) {

        require(_asset == address(usdcToken), "Some token not compatible");

        if (targetIsZero) {
            _amount = aUsdcToken.balanceOf(address(this));
        } 

        IPool pool = IPool(aaveProvider.getPool());
        aUsdcToken.approve(address(pool), _amount);
        uint256 withdrawAmount = pool.withdraw(_asset, _amount, address(this));
        return withdrawAmount;
    }

    function netAssetValue() external view override returns (uint256) {
        return aUsdcToken.balanceOf(address(this));
    }

    function liquidationValue() external view override returns (uint256) {
        return aUsdcToken.balanceOf(address(this));
    }

    function claimRewards(address _beneficiary) external override returns (uint256) {
        return 0;
    }
}