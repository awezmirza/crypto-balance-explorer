const apiKey = "X1QIYHSGZWGNAQB8PPGIWSFEQ67H5EV9S9";
const usdtContractAddress = "0xc2132D05D31c914a87C6611C10748AEb04B58e8F";
const usdcContractAddress = "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174";
const maticContractAddress = "0x0000000000000000000000000000000000001010";

const getCoin = (coin) => {
    if (coin == "USDT") return usdtContractAddress;
    else if (coin == "USDC") return usdcContractAddress;
    else return maticContractAddress;
}

let amounts = [];
async function inptStringToArray(fullString) {
    let lastIdx = 0;
    for (let i = 0; i < fullString.length; i++) {
        if (fullString[i] == ",") {
            let substr = fullString.substring(lastIdx, i - 1);
            substr = substr.trim();
            amounts.push(substr);
            lastIdx = i + 1;
        }
    }
    let substr = fullString.substring(lastIdx, fullString.length - 1);
    substr = substr.trim();
    amounts.push(substr);
}


async function getBalance(address, coinAddress) {
    try {
        const url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${coinAddress}&address=${address}&tag=latest&apikey=${apiKey}`
        const gotVal = await axios.get(url);
        console.log(gotVal.data);
        if (gotVal.data.status == 1) {
            if (coinAddress != maticContractAddress) {
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
    await inptStringToArray(addresses.value);
    addresses.value = "";
    console.log(amounts);

    const coin = document.querySelector("#coin").value;
    console.log(coin);
    const coinAddress = getCoin(coin);

    for (let address of amounts) {
        const amount = await getBalance(address, coinAddress);
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
                tr.innerHTML = `<th> Wallet Address </th> <th> Amount </th> <th> Coin</th>`;
                table.appendChild(tr);
                body.append(table);
            }
            const table = document.querySelector("table");
            const tr = document.createElement("tr");
            tr.innerHTML = ` <td> ${address} </td> <td> <b> ${amount} </td> </b>  <td> ${coin}</td>`;
            table.appendChild(tr);
            tableCreated = 1;
        }
    }
    amounts = []
})