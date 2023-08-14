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
  const [, , contractAddress] = process.argv;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

  const tokenizedBallotContract = TokenizedBallot__factory.connect(contractAddress, provider);

  // get the contract proposals and their vote count,
  // since we don't know the number of proposals,
  // we call the proposals() function until it throws an error.
  let i = 0;
  const proposals = [];
  while (i >= 0) {
    try {
      const proposal = await tokenizedBallotContract.proposals(i);
      proposals.push(proposal);
      i++;
    } catch (error) {
      i = -1;
    }
  }

  proposals.sort((a, b) => Number(b.voteCount - a.voteCount));

  const highestVoteCount = proposals[0].voteCount;

  const results = proposals.map(({ name, voteCount }) => ({
    Proposal: ethers.decodeBytes32String(name),
    Votes: Number(voteCount),
    Winner: voteCount === highestVoteCount ? "🏅" : "",
  }));

  console.table(results);
}
