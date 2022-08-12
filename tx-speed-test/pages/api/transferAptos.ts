import type { NextApiRequest, NextApiResponse } from 'next'
import { AptosClient, AptosAccount, FaucetClient, BCS, TxnBuilderTypes } from "aptos";

const transfer = async () => {

    // devnet is used here for testing
    // const NODE_URL = "https://fullnode.devnet.aptoslabs.com";
    // const FAUCET_URL = "https://faucet.devnet.aptoslabs.com";
    const NODE_URL = "http://0.0.0.0:8080";
    const FAUCET_URL = "http://0.0.0.0:8081";

    // APTOS_NODE_URL=http://54.225.13.60:8080
    // APTOS_FAUCET_URL=http://54.225.13.60:8000

    const client = new AptosClient(NODE_URL);
    const faucetClient = new FaucetClient(NODE_URL, FAUCET_URL);

    // Generates key pair for Alice
    const alice = new AptosAccount(
        new Uint8Array([
            27, 58, 157, 246, 217, 154, 232, 50, 246, 147, 61,
            172, 3, 226, 231, 146, 139, 130, 195, 33, 98, 207,
            82, 175, 77, 114, 69, 171, 123, 201, 32, 131, 66,
            83, 160, 109, 106, 122, 164, 8, 108, 46, 189, 80,
            149, 248, 114, 70, 184, 119, 233, 70, 55, 240, 42,
            26, 42, 7, 153, 92, 62, 248, 184, 83
        ]), "0x86762a584d97568622be7bf208759ad84ccd3cc8d5e8ca7ea48a7dd1ad176ed2"
    );
    // Creates Alice's account and mint 5000 test coins
    // await faucetClient.fundAccount(alice.address(), 5000);

    let resources = await client.getAccountResources(alice.address());
    let accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    console.log(`Alice coins: ${(accountResource?.data as any).coin.value}. Should be 5000!`);

    // Generates key pair for Bob
    const bob = new AptosAccount(
        new Uint8Array([
            86, 219, 118,  44, 111,  92, 104,   7,  57, 231,  47,
            26, 193,  75,  40, 195, 116, 157,   8, 137,  77,  90,
            98,  43,  46, 255, 105,  17,  58, 220,  67, 171, 123,
            36,  86, 223, 220,  32,  64, 195, 128, 114,   5, 178,
           178, 245, 147,  66, 123, 130, 199,  96,  43, 213, 105,
            94, 155,  11,  16,  69, 230, 247, 183,  69
         ]), "0x2f0b3efaf4cca87d400a170d7e46c77f23ef1670abfdc98e0178e9e1c0bf5495"
    );
    // console.log(bob);
    
    // Creates Bob's account and mint 0 test coins
    // await faucetClient.fundAccount(bob.address(), 0);

    resources = await client.getAccountResources(bob.address());
    accountResource = resources.find((r) => r.type === "0x1::coin::CoinStore<0x1::aptos_coin::AptosCoin>");
    console.log(`Bob coins: ${(accountResource?.data as any).coin.value}. Should be 0!`);
};

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
    transfer()
};
export default handler;
