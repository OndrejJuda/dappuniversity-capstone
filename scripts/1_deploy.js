const { ethers } = require("hardhat");
const hre = require("hardhat");

async function main() {
  // fetch contract
  const Token = await ethers.getContractFactory("Token");

  // deploy contract
  const token = await Token.deploy();
  await token.deployed();
  console.log(`Token Deployed to: ${token.address}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
