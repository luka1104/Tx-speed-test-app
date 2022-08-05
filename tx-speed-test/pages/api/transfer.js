import Web3 from 'web3'

const API_URL = process.env.API_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const provider = new Web3(new Web3.providers.HttpProvider(API_URL));
const contract = require('../../src/contracts/DemoToken.json');
const tokenAddress = process.env.TOKEN_ADDRESS;
const Contract = new provider.eth.Contract(contract.abi, tokenAddress, { from: PUBLIC_KEY });

const TransferToken = async (addr1, addr2) => {
    console.log('TRANSFERING TO', addr1,'AND', addr2);
    const data = await Contract.methods.multiTransfer([addr1, addr2], [100000000, 100000000]).encodeABI();
    const tx = {
        "gas": 500000,
        "to": tokenAddress,
        "value": "0x00",
        "data": data,
        "from": PUBLIC_KEY
    };
    const resp = await provider.eth.accounts.signTransaction(tx, PRIVATE_KEY, async (err, signedTx) => {
        if (err) return console.log('TRANS ERROR', err);
        console.log('SIGNING', signedTx)
        await provider.eth.sendSignedTransaction(signedTx.rawTransaction, (err, resp) => {
        if (err) return console.log('TRANSFER ERROR', err)
            console.log('SENDING', resp)
        });
    });
    return {status: 200, hash: resp.transactionHash};
};

const handler = async (req, res) => {
    const resp = await TransferToken("0x3f7E10eD4eac8c4a9c54ffbcD632215Aa78D598E", "0x50B80aa3877fC852f3194a0331177FDDcF0891bf")
    console.log(resp);
    const interval = setInterval(function() {
        console.log("Attempting to get transaction receipt...");
        provider.eth.getTransactionReceipt(resp.hash, function(err, rec) {
            if (rec) {
            console.log(rec);
            clearInterval(interval);
            res.status(200).json({ receipt: rec })
            }
        });
    }, 1000);
    
};
export default handler;
