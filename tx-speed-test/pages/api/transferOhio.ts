/* eslint-disable no-console */
import type { NextApiRequest, NextApiResponse } from 'next'
import "dotenv/config";
import { readFileSync } from "fs";
import path from 'path'
import { AptosClient, AptosAccount, FaucetClient, Types } from "../../ohio-sdk/sdk";

const transfer = async () => {

    const NODE_URL = process.env.APTOS_NODE_URL || "https://fullnode.devnet.aptoslabs.com";
    const FAUCET_URL = process.env.APTOS_FAUCET_URL || "https://faucet.devnet.aptoslabs.com";

    const client = new AptosClient(NODE_URL);

    const account = new AptosAccount(
        new Uint8Array([
          245, 35, 125, 25, 232, 1, 29, 18, 73, 85, 185, 190, 232, 27, 119, 144, 252, 136, 118, 101, 187, 208, 154, 83, 31,
          233, 19, 229, 197, 116, 242, 189, 126, 158, 23, 88, 68, 117, 62, 20, 137, 182, 156, 78, 212, 44, 223, 49, 197,
          182, 96, 89, 144, 171, 81, 60, 198, 22, 93, 146, 237, 3, 115, 98,
        ]),
        "0x59504cad27074c7ff8ac6af807a869af2a3f58b065a732ba3d322e8495987551",
    );

    // await faucetClient.fundAccount(account.address(), 1000);
    let resources = await client.getAccountResources(account.address());
    let accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    const balance = (accountResource?.data as { coin: { value: string } }).coin.value;
    console.log(`Account coins: ${balance}.`);
  
  
    // Create a contract
    const binaryDirectory = path.resolve('./src/contracts', 'DemoToken.bin')
    const file = readFileSync(binaryDirectory);
    let payload: Types.TransactionPayload = {
      type: "contract_bundle_payload",
      modules: [{ bytecode: file.toString() }],
    };
  
    let txnRequest = await client.generateTransaction(account.address(), payload);
    let signedTxn = await client.signTransaction(account, txnRequest);
    let transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
  
    resources = await client.getAccountResources(account.address());
    accountResource = resources.find((r) => r.type === "0x1::account::Evm");
    const { output: contractAddress } = accountResource?.data as { output: string };
    console.log(`EVM contract address: ${contractAddress}`);
  
  
    // Call Solidity function to transfer 1_000_000 bean tokens to account2
    const account2 = "a7f2ed757fc35ffce7a80462a8e3b9134bcdf0c7";
    payload = {
      type: "call_payload",
      code: {
        bytecode:
          `a9059cbb000000000000000000000000${ // transfer(to, amount)
          account2
          }00000000000000000000000000000000000000000000000000000000000f4240`, // 0x0f4240 = 1_000_000
      },
      type_arguments: [],
      arguments: [contractAddress],
    };
  
    const startTime = performance.now();
    txnRequest = await client.generateTransaction(account.address(), payload);
    signedTxn = await client.signTransaction(account, txnRequest);
    transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    const endTime = performance.now();
    console.log(`Call transfer tokens took ${Math.round(endTime - startTime)} ms`)
  
  
    // Get the minter's balance
    const minter = "07a869af2a3f58b065a732ba3d322e8495987551"; // Just the last 40 digits of account address
    payload = {
      type: "call_payload",
      code: { bytecode: `70a08231000000000000000000000000${minter}` },
      type_arguments: [],
      arguments: [contractAddress],
    };
  
    txnRequest = await client.generateTransaction(account.address(), payload);
    signedTxn = await client.signTransaction(account, txnRequest);
    transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
  
    resources = await client.getAccountResources(account.address());
    accountResource = resources.find((r) => r.type === "0x1::account::Evm");
    let { output } = accountResource?.data as { output: string };
    console.log(`EVM minter balance: ${parseInt(output, 16)}`);
  
  
    // Get the other account's balance
    payload = {
      type: "call_payload",
      code: { bytecode: `70a08231000000000000000000000000${account2}` },
      type_arguments: [],
      arguments: [contractAddress],
    };
  
    txnRequest = await client.generateTransaction(account.address(), payload);
    signedTxn = await client.signTransaction(account, txnRequest);
    transactionRes = await client.submitTransaction(signedTxn);
    await client.waitForTransaction(transactionRes.hash);
    let receipt = await client.getTransaction(transactionRes.hash);
    console.log(receipt);

    return receipt;
    // return transactionRes;
  
    resources = await client.getAccountResources(account.address());
    accountResource = resources.find((r) => r.type === "0x1::account::Evm");
    ({ output } = accountResource?.data as { output: string });
    console.log(`EVM account2 balance: ${parseInt(output, 16)}`);
    
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    const resp = await transfer();
    console.log(resp);
    if(resp) {
        res.status(200).json({ receipt: resp })
    }
};
export default handler;
