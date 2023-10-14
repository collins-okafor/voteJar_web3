const hre = require("hardhat");

async function main()
{
  const Voting = await ethers.getContractFactory("Voting");

  const Voting_ = await Voting.deploy(["David", "Princewill", "Jada", "Collins"], 90);

  console.log("Contract address:", Voting_.target);

}

main()
 .then(() => process.exit(0))
 .catch(error => {
   console.error(error);
   process.exit(1);
 });