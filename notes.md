### Commands

```

export STRATEGIST_ADDRESS=0x0000000000000000000000000000000000000000
export DEPLOY_FROM_ADDRESS=0x0000000000000000000000000000000000000000

# mainnet hard fork
NODE_OPTIONS=--max_old_space_size=4096 yarn net moonbeam  --fork-block-number 713832

# Account impersonation
curl --location --request POST 'localhost:8545' \
--header 'Content-Type: application/json' \
--data-raw '{
    "jsonrpc": "2.0",
    "id": "1",
    "method": "hardhat_impersonateAccount",
    "params": ["'$STRATEGIST_ADDRESS'"]
}'

# deploy chef locally
yarn deploy:chef localhost
```

### Deploy a contract on a local fork and debug it

```
export STRATEGIST_ADDRESS=0x0000000000000000000000000000000000000000
export DEPLOY_FROM_ADDRESS=0x0000000000000000000000000000000000000000

# run a ganache fork with some unlock addresses
NODE_OPTIONS=--max_old_space_size=4096 yarn run ganache-cli \
    --fork https://rpc.api.moonbeam.network \
    --fork-block-number 713832 \
    --unlock $STRATEGIST_ADDRESS \
    --unlock $DEPLOY_FROM_ADDRESS \
    --verbose

# deploy contract on local fork
yarn deploy:chef localhost

# TODO: EDIT ProdVaultTest.t.sol

# run forge tests
forge test --fork-url http://127.0.0.1:8545  --match-contract ProdVaultTest --debug test_depositAndWithdraw
```

## notes: (ex with MATIC-TEL)

```
Vault: BeefyVaultV6
    ex: https://polygonscan.com/address/0x14dC157f8BeF165B557599744c40b605F29cB1A0#code

Strategy: StrategyRewardPoolPolygonQuickLP
    ex: https://polygonscan.com/address/0xf9bd7bcdd8c5b6de4af7dff0a9af6f9494e6aa83#readContract

Strategy Parameters:
    _want: the LP contract
        ex: https://polygonscan.com/address/0xe88e24f49338f974b528ace10350ac4576c5c8a1#readContract

    _rewardPool: ?????
        looks like some external contract where we call "getRewards", "stake" and "withdraw"

    _vault: the vault address

    _unirouter: the quickswap router
        ex: https://polygonscan.com/address/0xa5e0829caced8ffdd4de3c43696c57f7d7a678ff

    _keeper: ?????
        doesn't seem to be user

    _strategist: address where strategist rewards are send to
        ex:
    address _beefyFeeRecipient
```

### TEL-USDC

TEL:
USDC:

want (LP pair):

### TEL-WETH

TEL: https://polygonscan.com/token/0xdf7837de1f2fa4631d716cf2502f8b230f1dcc32
WETH: https://polygonscan.com/token/0x7ceb23fd6bc0add59e62ac25578270cff1b9f619

want (LP pair):

### TEL ETH VAULT DEPLOY

```

Vault: 0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7
Strategy: 0x0BDa2aA1D590C7E8C41BFE17d54f2d85866DF1e5
Want: 0xFc2fC983a411C4B1E238f7Eb949308CF0218C750

Running post deployment
Setting call fee to '11'
Transfering Vault Owner to 0x94A9D4d38385C7bD5715A2068D69B87FF81F4BF3
```

### APE GLMR DEPLOY

```
Vault: 0x77089478c41b6a8B29dDD6E3cb2F475475A228A5
Strategy: 0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7
Want: 0x55Db71E6bEaB323290f6571C428C171e15CDBAD2
PoolId: 4
```
