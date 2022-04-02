import hardhat, { ethers, web3 } from "hardhat";
import { addressBook } from "blockchain-addressbook";
import { predictAddresses } from "../../utils/predictAddresses";
import { setCorrectCallFee } from "../../utils/setCorrectCallFee";
import { setPendingRewardsFunctionName } from "../../utils/setPendingRewardsFunctionName";
import { verifyContract } from "../../utils/verifyContract";
import { BeefyChain } from "../../utils/beefyChain";

const registerSubsidy = require("../../utils/registerSubsidy");

const {
  platforms: { quickswap, beefyfinance },
  tokens: {
    TEL: { address: TEL },
    ETH: { address: ETH },
    MATIC: { address: MATIC },
    QUICK: { address: QUICK },
    USDT: { address: USDT },
    USDC: { address: USDC },
  },
} = addressBook.polygon;

const shouldVerifyOnEtherscan = false;

const params = {
  strategyContractName: "StrategyQuickswapDualRewardLP",
  want: web3.utils.toChecksumAddress("0xfc2fc983a411c4b1e238f7eb949308cf0218c750"), // TEL-ETH (LP address)
  quickSwapRewardPool: web3.utils.toChecksumAddress("0xEda437364DCF8AB00f07b49bCc213CDf356b3962"),
  strategist: web3.utils.toChecksumAddress(process.env.STRATEGIST_ADDRESS || "0x000"), // metamask beefy dev
};

const vaultParams = {
  mooName: "Moo QuickSwap TEL-ETH",
  mooSymbol: "mooQuickSwapTEL-ETH",
  delay: 21600,
};

const contractNames = {
  vault: "BeefyVaultV6",
  strategy: params.strategyContractName,
};

async function main() {
  if (
    Object.values(vaultParams).some(v => v === undefined) ||
    Object.values(contractNames).some(v => v === undefined)
  ) {
    console.error("one of config values undefined");
    return;
  }

  await hardhat.run("compile");

  const Vault = await ethers.getContractFactory(contractNames.vault);
  const Strategy = await ethers.getContractFactory(contractNames.strategy);

  const [deployer] = await ethers.getSigners();

  console.log("Deploying:", vaultParams.mooName);

  const predictedAddresses = await predictAddresses({ creator: deployer.address });
  console.log("PredictedAddresses:", predictedAddresses);

  const vaultConstructorArguments = [
    predictedAddresses.strategy,
    vaultParams.mooName,
    vaultParams.mooSymbol,
    vaultParams.delay,
  ];
  console.log("Deploying vault contract");
  const vault = await Vault.deploy(...vaultConstructorArguments);
  console.log("Vault contract deployed");

  console.log("Calling vault.deployed()");
  await vault.deployed();
  console.log("vault.deployed() OK");

  const strategyConstructorArguments = [
    /*address _want */ params.want,
    /*address _rewardPool */ params.quickSwapRewardPool,
    /*address _vault */ vault.address,
    /*address _unirouter */ quickswap.router,
    /*address _keeper */ beefyfinance.keeper,
    /*address _strategist */ params.strategist,
    /*address _beefyFeeRecipient */ beefyfinance.beefyFeeRecipient,
    /* address[] memory _outputToNativeRoute */ [QUICK, MATIC],
    /* address[] memory _rewardToNativeRoute */ [TEL, ETH, MATIC],
    /* address[] memory _nativeToLp0Route */ [MATIC, ETH],
    /* address[] memory _nativeToLp1Route */ [MATIC, ETH, TEL],
  ];
  console.log("Deploying strategy contract");
  console.log(strategyConstructorArguments);
  const strategy = await Strategy.deploy(...strategyConstructorArguments);
  console.log("Strategy contract deployed");

  console.log("Calling strategy.deplyed()");
  await strategy.deployed();
  console.log("strategy.deplyed() OK");

  // add this info to PR
  console.log();
  console.log("Vault:", vault.address);
  console.log("Strategy:", strategy.address);
  console.log("Want:", params.want);

  console.log();
  console.log("Running post deployment");

  const verifyContractsPromises: Promise<any>[] = [];
  if (shouldVerifyOnEtherscan) {
    // skip await as this is a long running operation, and you can do other stuff to prepare vault while this finishes
    verifyContractsPromises.push(
      verifyContract(vault.address, vaultConstructorArguments),
      verifyContract(strategy.address, strategyConstructorArguments)
    );
  }
  // await setPendingRewardsFunctionName(strategy, strategyParams.pendingRewardsFunctionName);
  await setCorrectCallFee(strategy, hardhat.network.name as BeefyChain);
  // console.log(`Transfering Vault Owner to ${beefyfinance.vaultOwner}`);
  // await vault.transferOwnership(beefyfinance.vaultOwner);
  console.log();

  await Promise.all(verifyContractsPromises);

  if (hardhat.network.name === "bsc") {
    await registerSubsidy(vault.address, deployer);
    await registerSubsidy(strategy.address, deployer);
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
