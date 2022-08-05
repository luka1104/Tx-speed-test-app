// const hre = require("hardhat");

// async function main() {
//   const DEMO = await hre.ethers.getContractFactory("DemoToken");
//   const demo = await DEMO.deploy();

//   await demo.deployed();

//   console.log("DEMO deployed to:", demo.address);
// }

// main()
//   .then(() => process.exit(0))
//   .catch((error) => {
//     console.error(error);
//     process.exit(1);
//   });

async function main() {
    const [deployer] = await ethers.getSigners();
  
    console.log("Deploying contracts with the account:", deployer.address);
  
    const weiAmount = (await deployer.getBalance()).toString();
    
    console.log("Account balance:", (await ethers.utils.formatEther(weiAmount)));
  
    // make sure to replace the "GoofyGoober" reference with your own ERC-20 name!
    const Token = await ethers.getContractFactory("DemoToken");
    const token = await Token.deploy();
  
    console.log("Token address:", token.address);
    const ownerBalance = await token.balanceOf(deployer.address);
    console.log(ownerBalance);
    const transfer = await token.transfer('0x70997970C51812dc3A010C7d01b50e0d17dc79C8', 3000000000)
    console.log(transfer);
    const checkBalance = await token.balanceOf('0x70997970C51812dc3A010C7d01b50e0d17dc79C8')
    console.log(checkBalance);
    const ownerBalance2 = await token.balanceOf(deployer.address);
    console.log(ownerBalance2);
    // expect(await token.totalSupply()).to.equal(ownerBalance);
  }
  
  main()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
  });