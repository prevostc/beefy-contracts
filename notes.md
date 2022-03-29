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
No need to generate any newer typings.
Nothing to compile
No need to generate any newer typings.
Deploying: Moo QuickSwap TEL-ETH
PredictedAddresses: {
  vault: '0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7',
  strategy: '0x0BDa2aA1D590C7E8C41BFE17d54f2d85866DF1e5'
}
Deploying vault contract
Vault contract deployed
Calling vault.deployed()
vault.deployed() OK
Deploying strategy contract
[
  '0xFc2fC983a411C4B1E238f7Eb949308CF0218C750',
  '0xEda437364DCF8AB00f07b49bCc213CDf356b3962',
  '0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7',
  '0xa5E0829CaCEd8fFDD4De3c43696c57F7D7A678ff',
  '0x340465d9D2EbDE78F15a3870884757584F97aBB4',
  '0xb7087497749f7a54D8BC2A0e30cc5fcB010f4152',
  '0x6FB16F7F2C1f1BDA14d4277530A92d4404b7Fb7e',
  [
    '0x831753DD7087CaC61aB5644b308642cc1c33Dc13',
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  ],
  [
    '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32',
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270'
  ],
  [
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619'
  ],
  [
    '0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270',
    '0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619',
    '0xdF7837DE1F2Fa4631D716CF2502f8b230F1dcc32'
  ]
]
Strategy contract deployed
Calling strategy.deplyed()
strategy.deplyed() OK

Vault: 0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7
Strategy: 0x0BDa2aA1D590C7E8C41BFE17d54f2d85866DF1e5
Want: 0xFc2fC983a411C4B1E238f7Eb949308CF0218C750

Running post deployment
Setting call fee to '11'
Transfering Vault Owner to 0x94A9D4d38385C7bD5715A2068D69B87FF81F4BF3
```
