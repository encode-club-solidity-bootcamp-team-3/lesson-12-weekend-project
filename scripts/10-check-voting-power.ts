import { ethers } from "ethers";
import { TokenizedBallot__factory } from "../typechain-types";
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

  const tokenizedBallotContract = TokenizedBallot__factory.connect(contractAddress, provider);

  const votingPower = await tokenizedBallotContract.votingPower(accountAddress);

  console.log(votingPower);
}
