const hre = require("hardhat");

async function main() {
  const RSP = await hre.ethers.getContractFactory("RSP");
  const rsp = await RSP.deploy();

  await rsp.deployed();

  console.log("RSP deployed to:", rsp.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });