import { ethers } from "ethers";
import { MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

async function main() {
  const [, , tokenContractAddress, accountAddress] = process.argv;
    
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

  const tokenContract = MyToken__factory.connect(
    tokenContractAddress,
    provider
  );

  const balanceBN = await tokenContract.balanceOf(accountAddress);
  console.log(
    `Account ${accountAddress} has ${balanceBN.toString()} units of VTK.\n`
  );
}
