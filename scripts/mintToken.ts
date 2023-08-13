import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

try {
  main();
} catch (error) {
  console.error(error);
  process.exitCode = 1;
}

const mint_amount = ethers.parseUnits("1");

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() {
  
  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
    
  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(process.env.VTK_ADDRESS ?? "") as MyToken;

  // Mint some tokens
  const mintTx = await tokenContract.mint(signer.address, MINT_VALUE);
  await mintTx.wait();
  console.log(`Minted ${mint_amount.toString()} to ${signer.address}.\n`);
  const balanceBN = await tokenContract.balanceOf(signer.address);  
  console.log(`Account ${signer.address} has ${balanceBN.toString()} units of VTK.\n`);
}
