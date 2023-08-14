import { ethers } from "ethers";
import * as BallotJSON from "../artifacts/contracts/TokenizedBallot.sol/TokenizedBallot.json";
import * as dotenv from "dotenv";
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
  const signer = wallet.connect(provider);
  const balanceBN = await provider.getBalance(wallet.address);
  const balance = Number(ethers.formatUnits(balanceBN));
  console.log(`\nWallet balance ${balance}`);
  if (balance < 0.01) {
    throw new Error("Not enough ether");
  }

  const ballotContract = new ethers.Contract(
    ballot_contract_address,
    BallotJSON.abi,
    signer
  );

  // call the Solidity's vote function
  await ballotContract.vote(proposal_id, amount);

  const proposal_voted = await ballotContract.proposals(proposal_id);
  console.log(
    `\nUpdated total vote for ${
      proposal_voted.name
    } = ${await proposal_voted.voteCount}.`
  );
  console.log(`Wallet balance ${balance}\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
