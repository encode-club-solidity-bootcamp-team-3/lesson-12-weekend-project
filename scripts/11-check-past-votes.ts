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
  const [, , tokenContractAddress, ballotContractAddress, accountAddress] = process.argv;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

  const tokenContract = MyToken__factory.connect(
    tokenContractAddress,
    provider
  );

  const ballotContract = TokenizedBallot__factory.connect(
    ballotContractAddress,
    provider
  );

  const targetBlockNumber = await ballotContract.targetBlockNumber();

  console.log({ targetBlockNumber });
  
  const pastVotes = await tokenContract.getPastVotes(
    accountAddress,
    targetBlockNumber
  );

  console.log({ pastVotes });
}
