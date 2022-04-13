require("@nomiclabs/hardhat-waffle");
require("dotenv").config()

require('@nomiclabs/hardhat-ethers');
require("@nomiclabs/hardhat-web3");

require('hardhat-deploy');

const POLYGON_API_KEY=process.env.POLYGON_API_KEY || ""

module.exports = {
  
  namedAccounts: {
    deployer: {
        default: 0,
    },

    recipient: {
        default: 1,
    },

    anotherAccount: {
        default: 2
    }
  },
  solidity: "0.8.10",
  defaultNetwork: "hardhat",
  networks: {
    hardhat: {
      forking: {
          url: POLYGON_API_KEY,
          blockNumber: 26969990,
      },
    },    
  },
};
