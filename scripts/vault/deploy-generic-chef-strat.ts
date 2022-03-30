import hardhat, { ethers, web3 } from "hardhat";
import { addressBook } from "blockchain-addressbook";
import { predictAddresses } from "../../utils/predictAddresses";
import { setCorrectCallFee } from "../../utils/setCorrectCallFee";
import { setPendingRewardsFunctionName } from "../../utils/setPendingRewardsFunctionName";
import { verifyContract } from "../../utils/verifyContract";
import { BeefyChain } from "../../utils/beefyChain";

const registerSubsidy = require("../../utils/registerSubsidy");

const {
  platforms: { stellaswap, beefyfinance },
  tokens: {
    //APE: { address: APE },
    STELLA: { address: STELLA },
    GLMR: { address: GLMR },
  },
} = addressBook.moonbeam;
const APE = "0x3d632d9e1a60a0880dd45e61f279d919b5748377";

const shouldVerifyOnEtherscan = false;

const want = web3.utils.toChecksumAddress("0x55db71e6beab323290f6571c428c171e15cdbad2");

const vaultParams = {
  mooName: "Moo Stellaswap APE-GLMR",
  mooSymbol: "mooStellaswapAPE-GLMR",
  delay: 21600,
};

const strategyParams = {
  want,
  poolId: 4, // find it in pool infos
  chef: "0xf3a5454496e26ac57da879bf3285fa85debf0388", //stellaswap.masterchefV1distributorV2,
  unirouter: stellaswap.router,
  strategist: web3.utils.toChecksumAddress("0xb7087497749f7a54D8BC2A0e30cc5fcB010f4152"), // some address
  keeper: beefyfinance.keeper,
  beefyFeeRecipient: beefyfinance.beefyFeeRecipient,
  outputToNativeRoute: [STELLA, GLMR],
  outputToLp0Route: [STELLA, GLMR, APE],
  outputToLp1Route: [STELLA, GLMR],
  pendingRewardsFunctionName: "pendingTokens", // used for rewardsAvailable(), use correct function name from masterchef
};

const contractNames = {
  vault: "BeefyVaultV6",
  strategy: "StrategyCommonChefLP",
};

async function main() {
  if (
    Object.values(vaultParams).some(v => v === undefined) ||
    Object.values(strategyParams).some(v => v === undefined) ||
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
    strategyParams.want,
    strategyParams.poolId,
    strategyParams.chef,
    vault.address,
    strategyParams.unirouter,
    strategyParams.keeper,
    strategyParams.strategist,
    strategyParams.beefyFeeRecipient,
    strategyParams.outputToNativeRoute,
    strategyParams.outputToLp0Route,
    strategyParams.outputToLp1Route,
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
  console.log("Want:", strategyParams.want);
  console.log("PoolId:", strategyParams.poolId);

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
  console.log(`Transfering Vault Owner to ${beefyfinance.vaultOwner}`);
  await vault.transferOwnership(beefyfinance.vaultOwner);
  console.log("Ownership transferred");

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
