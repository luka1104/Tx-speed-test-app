/**
 * @type import(‘hardhat/config’).HardhatUserConfig
 */
 require("dotenv").config();
 require("@nomiclabs/hardhat-ethers");
 const { API_URL, ETH_API, PRIVATE_KEY } = process.env;
 module.exports = {
    solidity: "0.8.9",
    defaultNetwork: "mumbai",
    networks: {
      hardhat: {},
      mumbai: {
        url: API_URL,
        accounts: [`0x${PRIVATE_KEY}`],
      },
      goerli: {
        url: ETH_API,
        accounts: [`0x${PRIVATE_KEY}`],
      },
    },
 };