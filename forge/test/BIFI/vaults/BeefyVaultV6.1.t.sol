// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;


import {BaseTestHarness, console} from "@beefy-contracts-test/utils/BaseTestHarness.sol";
import {BeefyVaultV6} from "@beefy-contracts/vaults/BeefyVaultV6.1.sol";




contract BeefyVaultV61Test is BaseTestHarness {

    BeefyVaultV6 vault;

    function setUp() public {
        //vault = new BeefyVaultV6();
    }

    function testNumberIs42() public {
        //assertTrue(address(vault) != address(0));
    }
}