// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;


import "ds-test/test.sol";

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ERC20Mock} from "@openzeppelin/contracts/mocks/ERC20Mock.sol";
import {console} from "@beefy-contracts-test/forge/console.sol";
import {VaultUser} from "@beefy-contracts-test/users/VaultUser.pragma6.sol";
import {IBeefyVaultV6} from "@beefy-contracts-test/interfaces/IBeefyVaultV6.sol";

import {IStrategy} from "@beefy-contracts/interfaces/beefy/IStrategy.sol";
import {BeefyVaultV6} from "@beefy-contracts/vaults/BeefyVaultV6.sol";
import {StrategyMock} from "@beefy-contracts/mocks/StrategyMock.sol";


contract BeefyVaultV6Test is DSTest {

    VaultUser vaultOwner;
    VaultUser user;
    IERC20 want;
    BeefyVaultV6 vault;
    IStrategy strategy;

    function setUp() public {
        vaultOwner = new VaultUser();
        user = new VaultUser();
        want = new ERC20Mock("Want", "WAN", address(user), 10**18);
        strategy = new StrategyMock(want);
        vault = new BeefyVaultV6(strategy, "Test Vault", "mooWant", 50);

        // transfer some funds to test contracts
        user.infiniteApprove(address(want), address(this));
        user.infiniteApprove(address(vault), address(this));
        user.infiniteApprove(address(want), address(vault));
        user.infiniteApprove(address(vault), address(vault));
        want.transferFrom(address(user), address(strategy), 100);
        want.transferFrom(address(user), address(vault), 50);
    }

    function test_balance_sums_strategy_and_vault() public {
        assertEq(vault.balance(), 150);
    }

    function test_available_is_vault_balance_of_want() public {
        assertEq(vault.available(), 50);
    }
    function test_simple_deposit() public {
        // ppfs should be 1 by default as no one has deposited yet
        assertEq(vault.getPricePerFullShare(), 1*1e18);
        // total supply should eq
        assertEq(want.totalSupply(), 1*1e18);
        // make a deposit
        user.deposit(IBeefyVaultV6(address(vault)), 12);
        // ppsf should be updated
        assertEq(vault.getPricePerFullShare(), ((150+12)/12)*1e18);
        // user moo token balance should be updated
        assertEq(vault.balanceOf(address(user)), 12);
        // funds should have been transfered to the strategy
        assertEq(want.balanceOf(address(vault)), 0);
        assertEq(want.balanceOf(address(strategy)), 12+150);
        assertEq(want.totalSupply(), 12*1e18);
    }
}