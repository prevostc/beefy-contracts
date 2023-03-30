// SPDX-License-Identifier: MIT

pragma solidity ^0.8.12;

import "@openzeppelin-4/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin-4/contracts/token/ERC20/presets/ERC20PresetFixedSupply.sol";

//import "forge-std/Test.sol";
import "../../node_modules/forge-std/src/Test.sol";
import "./library/SafeERC20Latest.sol";

/**
Running 5 tests for forge/test/ApprovalGasFee.t.sol:ApprovalGasFee
[PASS] testFail_doubleMaxApprovalFails() (gas: 36127)
[PASS] test_approvalWithReset() (gas: 51272)
[PASS] test_increasingAllowance() (gas: 45052)
[PASS] test_testingAllowancesFirst() (gas: 51216)
[PASS] test_usingLatestForceApprove() (gas: 37254)
Test result: ok. 5 passed; 0 failed; finished in 1.54ms
 */
contract ApprovalGasFee is Test {
    using SafeERC20 for IERC20;

    address user;
    address spender;
    IERC20 token;

    function setUp() public {
        user = address(0x3991aCBBD3E6bf973295e1FAad070De97289b4CA);
        token = new ERC20PresetFixedSupply("A token", "TK", 1 ether, address(this));
        spender = address(this);
        token.transfer(user, 1 ether);
    }
    
    function testFail_doubleMaxApprovalFails() external {
        IERC20(token).safeApprove(spender, type(uint).max);
        IERC20(token).safeApprove(spender, type(uint).max);
    }

    function test_approvalWithReset() external {
        IERC20(token).safeApprove(spender, 0);
        IERC20(token).safeApprove(spender, type(uint).max);

        IERC20(token).safeApprove(spender, 0);
        IERC20(token).safeApprove(spender, type(uint).max);
    }

    function test_testingAllowancesFirst() external {
        if (IERC20(token).allowance(address(this), spender) != 0) {
            IERC20(token).safeApprove(spender, 0);
        }
        IERC20(token).safeApprove(spender, type(uint).max);

        if (IERC20(token).allowance(address(this), spender) != 0) {
            IERC20(token).safeApprove(spender, 0);
        }
        IERC20(token).safeApprove(spender, type(uint).max);


        assertEq(IERC20(token).allowance(address(this), spender), type(uint).max);
    }

    function test_increasingAllowance() external {
        uint allowance = IERC20(token).allowance(address(this), spender);
        IERC20(token).safeIncreaseAllowance(spender, type(uint).max - allowance);

        allowance = IERC20(token).allowance(address(this), spender);
        IERC20(token).safeIncreaseAllowance(spender, type(uint).max - allowance);

        assertEq(IERC20(token).allowance(address(this), spender), type(uint).max);
    }

    function test_usingLatestForceApprove() external {
        SafeERC20Latest.forceApprove(token, spender, type(uint).max);
        SafeERC20Latest.forceApprove(token, spender, type(uint).max);
    }
}