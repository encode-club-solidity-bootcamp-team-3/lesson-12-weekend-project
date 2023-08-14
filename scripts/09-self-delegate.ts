import { Wallet, ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";

dotenv.config();

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

async function main() {
  const [, , tokenContractAddress] = process.argv;

  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL);

  const myTokenContract = MyToken__factory.connect(
    tokenContractAddress,
    provider
  );

  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY!, provider);

  console.log("Check balances before self delegating");
  await checkBalances(myTokenContract, wallet);

  console.log("Self delegating...");
  const delegateTx = await myTokenContract
    .connect(wallet)
    .delegate(wallet.address);
  await delegateTx.wait();

  console.log("Check balances after self delegating");
  await checkBalances(myTokenContract, wallet);
}

async function checkBalances(myTokenContract: MyToken, wallet: Wallet) {
  const balanceBN = await myTokenContract.balanceOf(wallet.address);
  console.log(`${wallet.address} has ${balanceBN.toString()} decimals units of MyToken`);

  const votes = await myTokenContract.getVotes(wallet.address);
  console.log(
    `${wallet.address} has ${votes.toString()} units of voting power`
  );
}