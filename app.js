const polyApiKey = "X1QIYHSGZWGNAQB8PPGIWSFEQ67H5EV9S9";
const etherApiKey = "N6AAJCSUEIX8X1FVJMH9DR34HJQ6QGAU5P";
const polyUsdtContractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const polyUsdcContractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const polyMaticContractAddress = "0x0000000000000000000000000000000000001010";

const etherUsdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7";
const etherUsdcContractAddress = "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48";
const etherMaticContractAddress = "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0";

let coinAddress = "";

const getCoin = (coin) => {
    if (coin == "USDT") return polyUsdtContractAddress;
    else if (coin == "USDC") return polyUsdcContractAddress;
    else return polyMaticContractAddress;
}

const setEthCoin = (coin) => {
    if (coin == "USDT") return etherUsdtContractAddress;
    else if (coin == "USDC") return etherUsdcContractAddress;
    else return etherMaticContractAddress;
}

let amounts = [];
async function inptStringToArray(fullString) {
    let lastIdx = 0;
    for (let i = 0; i < fullString.length; i++) {
        if (fullString[i] == ",") {
            let substr = fullString.substring(lastIdx, i);
            substr = substr.trim();
            lastIdx = i + 1;
            if (substr == "" || substr == " ") continue;
            amounts.push(substr);
        }
    }
    let substr = fullString.substring(lastIdx, fullString.length);
    substr = substr.trim();
    if (!(substr == "" || substr == " ")) amounts.push(substr);
}

async function getBalance(address, coinAddress, chain) {
    try {
        if (chain == "Ethereum") {
            url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${coinAddress}&address=${address}&tag=latest&apikey=${etherApiKey}`;
        }
        else {
            url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${coinAddress}&address=${address}&tag=latest&apikey=${polyApiKey}`;
        }
        const gotVal = await axios.get(url);
        console.log(gotVal.data);
        if (gotVal.data.status == 1) {
            if (coinAddress != polyMaticContractAddress || coinAddress != etherMaticContractAddress) {
                return (gotVal.data.result * 0.000001);
            }
            else {
                return (gotVal.data.result * 0.000000000000000001);
            }
        }
        else {
            return -1;
        }
    } catch (error) {
        return -1;
    }
}

let tableCreated = 0;
const btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
    const addresses = document.querySelector("#inpt");
    const chain = document.querySelector("#chain").value;

    await inptStringToArray(addresses.value);

    addresses.value = "";

    const coin = document.querySelector("#coin").value;
    console.log(coin);
    if (chain == "Ethereum") {
        coinAddress = setEthCoin(coin)
    }
    else {
        coinAddress = getCoin(coin)
    }

    for (let address of amounts) {

        const amount = await getBalance(address, coinAddress, chain);
        const body = document.querySelector("body");
        if (amount == -1) {
            const h2 = document.createElement("h2");
            h2.innerHTML = `Something went wrong for wallet address: ${address}`;
            body.append(h2);
        }
        else {
            if (!tableCreated) {
                const table = document.createElement("table");
                const tr = document.createElement("tr");
                tr.innerHTML = `<th> Wallet Address </th> <th> Amount </th> <th> Coin</th> <th> Blockchain </th>`;
                table.appendChild(tr);
                body.append(table);
            }
            const table = document.querySelector("table");
            const tr = document.createElement("tr");
            tr.innerHTML = ` <td> ${address} </td> <td> <b> ${amount} </td> </b>  <td> ${coin}</td> <td> ${chain}`;
            table.appendChild(tr);
            tableCreated = 1;
        }
    }
    amounts = []
})
