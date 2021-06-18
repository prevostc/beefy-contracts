import hre from "hardhat";
import "hardhat-deploy";
import "@nomiclabs/hardhat-ethers";

import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction, DeployOptions } from 'hardhat-deploy/types';

import "../utils/registerSubsidy";
import "../utils/hardhatRPC";
import { contractAddressGenerator } from "../utils/predictAddresses";

import vaults from "../deployData/SingleChef";
import { addressBook, ChainId } from "blockchain-addressbook";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/dist/src/signers";

import { BeefyVaultV6__factory, StrategyCommonChefSingle__factory } from "../typechain";

const VAULT_CONTRACT = "BeefyVaultV6";
const STRAT_CONTRACT = "StrategyCommonChefSingle";

type VaultConstructorParams = Parameters<BeefyVaultV6__factory["deploy"]>;
type StratConstructorParams = Parameters<StrategyCommonChefSingle__factory["deploy"]>;

function getDeployOptions<P extends any[]>(deployer: SignerWithAddress, contract: string, args:P) {
    return {
        from: deployer.address,
        contract: contract,
        args: args,
        skipIfAlreadyDeployed: true,
        log: true
    } as DeployOptions;
}

const deployAllVaults: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    let vaultDeployOptions:DeployOptions | null = null;
    let stratDeployOptions:DeployOptions | null = null;
    try {
        const { deploy, execute, read, fetchIfDifferent } = hre.deployments;

        const deployer = await hre.ethers.getNamedSigner('deployer');
        console.log(`Deployer: ${deployer.address}\n`);

        for (let vault in vaults) {
            let config = vaults[vault];
            if (config.chainId != hre.network.config.chainId) continue;

            let beefyfinance = addressBook[ChainId[config.chainId]].platforms.beefyfinance;

            let contractAddress = await contractAddressGenerator(deployer);

            let mooName = `Moo ${config.platform} ${config.want.symbol}`;
            let mooSymbol = `moo${config.platform}${config.want.symbol}`;
            let vaultName = `${mooName} Vault`;
            let stratName = `${mooName} Strategy`

            let vaultParams:VaultConstructorParams = [
                '0xStrategy',
                mooName,
                mooSymbol,
                21600,
            ]

            let strategyParams:StratConstructorParams = [
                config.want.address,
                config.poolId,
                config.chef,
                '0xVault',
                config.unirouter,
                beefyfinance.keeper,
                config.strategist,
                beefyfinance.beefyFeeRecipient,
                config.outputToNativeRoute,
                config.outputToWantRoute
            ];

            let deployedVault = await hre.deployments.getOrNull(vaultName);
            let deployedStrat = await hre.deployments.getOrNull(stratName);

            let vaultDeployOptions:DeployOptions | null = null;
            let stratDeployOptions:DeployOptions | null = null;

            if (deployedVault && deployedStrat) {
                vaultParams[0] = deployedStrat.address;
                strategyParams[4] = deployedVault.address;

                vaultDeployOptions = getDeployOptions<VaultConstructorParams>(deployer, VAULT_CONTRACT, vaultParams);
                stratDeployOptions = getDeployOptions<StratConstructorParams>(deployer, STRAT_CONTRACT, strategyParams);

                if ((await fetchIfDifferent(vaultName, vaultDeployOptions)).differences
                    || (await fetchIfDifferent(stratName, stratDeployOptions)).differences
                    ) {
                    deployedVault = null;
                    deployedStrat = null;
                }
            }

            if (!deployedVault || !deployedStrat) {
                strategyParams[3] = (await contractAddress.next()).value as string;
                vaultParams[0] = (await contractAddress.next()).value as string;
                vaultDeployOptions = getDeployOptions<VaultConstructorParams>(deployer, VAULT_CONTRACT, vaultParams);
                stratDeployOptions = getDeployOptions<StratConstructorParams>(deployer, STRAT_CONTRACT, strategyParams);
            }

            if (vaultDeployOptions === null) throw "Impossible";
            if (stratDeployOptions === null) throw "Impossible";

            const vaultDeployResult = await deploy(vaultName, vaultDeployOptions);
            const stratDeployResult = await deploy(stratName, stratDeployOptions);
        }
    }
    catch (e) {
        console.error(e);
        console.debug(vaultDeployOptions);
        console.debug(stratDeployOptions);
    }
};
export default deployAllVaults;