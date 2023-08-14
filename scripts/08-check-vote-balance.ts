import { ethers } from "ethers";
import { MyToken__factory, TokenizedBallot__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

async function main() {
  const [, , contractAddress, accountAddress] = process.argv;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

  const myTokenContract = MyToken__factory.connect(contractAddress, provider);

  const votes = await myTokenContract.getVotes(accountAddress);

  console.log(votes);
}
