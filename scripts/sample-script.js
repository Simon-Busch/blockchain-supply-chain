const hre = require("hardhat");

async function main() {
  const ItemManager = await hre.ethers.getContractFactory("ItemManager");
  const ItemManagerContract = await ItemManager.deploy("Hello, Hardhat!");

  await ItemManagerContract.deployed();

  console.log("ItemManagerContract deployed to:", ItemManagerContract.address);

  const Item = await hre.ethers.getContractFactory("Item");
  const ItemContract = await Item.deploy("Hello, Hardhat!");

  await ItemContract.deployed();

  console.log("ItemContract deployed to:", ItemContract.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
