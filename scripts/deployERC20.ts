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


function setupProvider() {
    const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
    return provider;
}

async function main() {
    const provider = setupProvider();
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
    const balanceBN = await provider.getBalance(wallet.address);
    const balance = Number(ethers.formatUnits(balanceBN));
    console.log(`\nWallet balance ${balance}.`);
    if (balance < 0.01) {
        throw new Error("Not enough ether.");
    }
    const ballotFactory = new MyToken__factory(wallet);
    const ballotContract = await ballotFactory.deploy();
    await ballotContract.waitForDeployment();
    const address = await ballotContract.getAddress();
    console.log(`The contract is deployed at address ${address}.`)
    console.log(`Wallet balance ${balance}.`);
}

