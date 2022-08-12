require("dotenv").config();

module.exports = {
  env: {
    PRIVATE_KEY: process.env.PRIVATE_KEY,
    PUBLIC_KEY: process.env.PUBLIC_KEY,
    TOKEN_ADDRESS: process.env.TOKEN_ADDRESS,
    API_URL: process.env.API_URL,
    ETH_API: process.env.ETH_API,
    ETH_TOKEN_ADDRESS: process.env.ETH_TOKEN_ADDRESS,
    APTOS_NODE_URL: process.env.APTOS_NODE_URL,
    APTOS_FAUCET_URL: process.env.APTOS_FAUCET_URL
  },
}