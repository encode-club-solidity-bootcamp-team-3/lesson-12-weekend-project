import { ethers } from "ethers";
import * as BallotJSON from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
import { TokenizedBallot__factory } from "../typechain-types";
dotenv.config();

function setupProvider() {
  const provider = new ethers.JsonRpcProvider(
    process.env.RPC_ENDPOINT_URL ?? ""
  );
  return provider;
}

async function main() {
  // the contract address is hard-coded
  const ballot_contract_address = process.env.BALLOT_ADDRESS ?? "";
  // proposal index is the first argument in the command line
  const proposal_id = process.argv[2];
  // the voting power to spend is the second argument in the command line
  const amountInDecimal = parseFloat(process.argv[3]);

  if (isNaN(amountInDecimal) || amountInDecimal < 0) {
    throw new Error("Invalid or negative vote amount");
  }

  // Convert the decimal vote amount into base units of the token
  const tokenDecimals = 18; // Assuming the token has 18 decimals
  const amount = ethers.parseUnits(amountInDecimal.toString(), tokenDecimals);

  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);

  const ballotContract = TokenizedBallot__factory.connect(
    ballot_contract_address,
    wallet
  );

  // control voting power before voting
  const votingPower = await ballotContract.votingPower(wallet.address);
  console.log(
    `voter account ${wallet.address} has this current voting power ${votingPower}`
  );
  console.log(
    `voter account ${wallet.address} is willing to vote with this amount ${amount}`
  );

  // call the Solidity's vote function
  const voteTx = await ballotContract.vote(proposal_id, amount);
  await voteTx.wait();
  console.log({ voteTx });
  
  const proposal_voted = await ballotContract.proposals(proposal_id);
  console.log(`Updated total vote for ${proposal_voted.name} = ${proposal_voted.voteCount}.`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
