import {ethers} from "hardhat";

const {
    FRONT_RUN_CONTRACT_ADDRESS: FRONT_RUN_CONTRACT_ADDRESS_ENV
} = process.env;

const FRONT_RUN_CONTRACT_ADDRESS = ethers.utils.getAddress(FRONT_RUN_CONTRACT_ADDRESS_ENV!);


async function main() {
    const contractInterface = (await ethers.getContractFactory("FrontRun")).interface;
    const provider = new ethers.providers.WebSocketProvider(
        "wss://eth-goerli.g.alchemy.com/v2/<api-key>"
    );

    provider.on("pending", async (tx: any) => {
        const txnData = await provider.getTransaction(tx);
        if (txnData["to"]) {
            if (ethers.utils.getAddress(txnData.to!) == FRONT_RUN_CONTRACT_ADDRESS) {
                console.log('txnData', txnData);
                console.log("hash: ", txnData["hash"]);
                let decoded = contractInterface.decodeFunctionData("solve(string)", txnData["data"]);
                console.log('decoded', decoded);
                await resubmitTxWithHighGas(txnData, provider);
            }
        }
    });
}

async function resubmitTxWithHighGas(transaction: any, provider: any) {

    let privatekey = '<private-key>';
    let wallet = new ethers.Wallet(privatekey, provider);

    transaction.from = await wallet.getAddress();

    const craftedTx = {
        from: await wallet.getAddress(),
        data: transaction.data,
        to: transaction.to,
        gasPrice: transaction.gasPrice.mul(3),
        gasLimit: transaction.gasLimit,
        nonce: (await wallet.getTransactionCount())
    };

    const rawTransaction = await wallet.signTransaction(craftedTx);

    const tx = await (await provider.sendTransaction(rawTransaction)).wait();

    console.log('tx', tx);
    process.exit(0);
}

console.log("Listening for pending transactions...");

(async () => {
    await main();
})();
