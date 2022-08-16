import Web3 from 'web3'

const PRIVATE_KEY = process.env.PRIVATE_KEY;
const PUBLIC_KEY = process.env.PUBLIC_KEY;
const provider = new Web3(new Web3.providers.HttpProvider(process.env.API_URL));
const ethProvider = new Web3(new Web3.providers.HttpProvider(process.env.ETH_API));
const contract = require('../../src/contracts/DemoToken.json');
const tokenAddress = process.env.TOKEN_ADDRESS;
const ethTokenAddress = process.env.ETH_TOKEN_ADDRESS;
const Contract = new provider.eth.Contract(contract.abi, tokenAddress, { from: PUBLIC_KEY });
const EthContract = new ethProvider.eth.Contract(contract.abi, ethTokenAddress, { from: PUBLIC_KEY });

const TransferToken = async (provider, contract, addr1, addr2) => {
    console.log('TRANSFERING TO', addr1,'AND', addr2);
    const data = await contract.methods.multiTransfer([addr1, addr2], [100_000_000, 100_000_000]).encodeABI();
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
    const blockchainProvider = req.body.chain === 'ethereum' ? ethProvider : provider;
    const blockchainContract = req.body.chain === 'ethereum' ? EthContract : Contract;
    const resp = await TransferToken(blockchainProvider, blockchainContract, "0x3f7E10eD4eac8c4a9c54ffbcD632215Aa78D598E", req.body.address)
    console.log(resp);
    const interval = setInterval(function() {
        console.log("Attempting to get transaction receipt...");
        blockchainProvider.eth.getTransactionReceipt(resp.hash, function(err, rec) {
            if (rec) {
                console.log(rec);
                clearInterval(interval);
                res.status(200).json({ receipt: rec })
            }
        });
    }, 100);
};
export default handler;
