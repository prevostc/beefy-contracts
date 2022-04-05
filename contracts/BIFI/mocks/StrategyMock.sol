// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "../interfaces/beefy/IStrategy.sol";

contract StrategyMock is IStrategy {
    using SafeERC20 for IERC20;
    using SafeMath for uint256;

    IERC20 public _want;

    event BeforeDeposit();
    event StratHarvest(address indexed harvester, uint256 wantHarvested, uint256 tvl);
    event Deposit(uint256 tvl);
    event Withdraw(uint256 tvl);
    event ChargedFees(uint256 callFees, uint256 beefyFees, uint256 strategistFees);
    event Harvest();
    event RetireStrat();
    event Pause();
    event Unpause();
    event Panic();

    constructor(IERC20 _mockWant) public {
        _want = _mockWant;
    }

    function vault() external view override(IStrategy) returns (address) {
        return address(0);
    }
    function want() external view override(IStrategy) returns (IERC20) {
        return _want;
    }
    
    function beforeDeposit() external override(IStrategy) {
        emit BeforeDeposit();
    }
    function deposit() external override(IStrategy) {
        emit Deposit(0);
    }
    function withdraw(uint256 param) external override(IStrategy) {
        emit Withdraw(param);
    }
    function balanceOf() external view override(IStrategy) returns (uint256) {
        return balanceOfWant().add(balanceOfPool());
    }
    function balanceOfWant() public view override(IStrategy) returns (uint256) {
        return IERC20(_want).balanceOf(address(this));
    }
    function balanceOfPool() public view override(IStrategy) returns (uint256) {
        return 0;
    }
    function harvest() external override(IStrategy) {
        emit Harvest();
    }
    function retireStrat() external override(IStrategy) {
        emit RetireStrat();
    }
    function panic() external override(IStrategy) {
        emit Panic();
    }
    function pause() external override(IStrategy) {
        emit Pause();
    }
    function unpause() external override(IStrategy) {
        emit Unpause();
    }    
    function paused() public view override(IStrategy) returns (bool) {
        return false;
    }

    function unirouter() external view override(IStrategy) returns (address) {
        return address(0);
    }
}
