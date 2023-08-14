import { ethers } from "ethers";
import { MyToken, MyToken__factory } from "../typechain-types";
import * as dotenv from "dotenv";
dotenv.config();

const MINT_VALUE = ethers.parseUnits("1"); 

// Either divide the total amount by however people we want, or hardcode it. In this case, I've devided it by 3
const TX_VALUE = MINT_VALUE / 3n

function setupProvider(){
  const provider = new ethers.JsonRpcProvider(process.env.RPC_ENDPOINT_URL ?? "");
  return provider;
}

async function main() { 

  const [, , addressTo] = process.argv; 

  const provider = setupProvider();
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY ?? "", provider);
  const signer = wallet.connect(provider);
     
  const tokenContractFactory = new MyToken__factory(signer);
  const tokenContract = tokenContractFactory.attach(process.env.VTK_ADDRESS ?? "") as MyToken;

  // transfer from deployer to input account
  const transferTx = await tokenContract.connect(signer).transfer(addressTo, TX_VALUE);
  await transferTx.wait();
  console.log(`Transfered ${TX_VALUE.toString()} to ${addressTo}.\n`);
  
  const balanceBN = await tokenContract.balanceOf(signer.address);  
  console.log(`Account ${signer.address} has ${balanceBN.toString()} VTK.\n`);

  
  const balanceToAfterTransfer = await tokenContract.balanceOf(addressTo);
  console.log(`Account ${addressTo} has ${balanceToAfterTransfer.toString()} VTK.\n`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
