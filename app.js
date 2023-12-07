const data = {
    polygon: {
        apiKey: "X1QIYHSGZWGNAQB8PPGIWSFEQ67H5EV9S9",
        tokens: {
            USDT: {
                tokenAddress: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
                decimal: 0.000001
            },
            USDC: {
                tokenAddress: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174",
                decimal: 0.000001
            },
            Matic: {
                tokenAddress: "0x0000000000000000000000000000000000001010",
                decimal: 0.000000000000000001
            }
        }
    },
    ethereum: {
        apiKey: "N6AAJCSUEIX8X1FVJMH9DR34HJQ6QGAU5P",
        tokens: {
            USDT: {
                tokenAddress: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
                decimal: 0.000001
            },
            USDC: {
                tokenAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
                decimal: 0.000001
            },
            Matic: {
                tokenAddress: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
                decimal: 0.000000000000000001
            }

        }
    }
}

// let tableObject = {adresses : [], amounts: [], };

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

async function getBalance(address, chain, coin) {
    try {
        const coinAddress = data[chain].tokens[coin].tokenAddress;
        if (chain == "ethereum") {
            url = `https://api.etherscan.io/api?module=account&action=tokenbalance&contractaddress=${coinAddress}&address=${address}&tag=latest&apikey=${data[chain].apiKey}`;
        }
        else {
            url = `https://api.polygonscan.com/api?module=account&action=tokenbalance&contractaddress=${coinAddress}&address=${address}&tag=latest&apikey=${data[chain].apiKey}`;
        }
        const gotVal = await axios.get(url);
        if (gotVal.data.status == 1) {
            return (gotVal.data.result * data[chain].tokens[coin].decimal);
        }
        else {
            return -1;
        }
    } catch (error) {
        return -1;
    }
}

const btnCopyTable = document.querySelector('#btn-copy-table');
const exportTable = document.querySelector('#export');

let tableCreated = 0;
const btn = document.getElementById("btn");
btn.addEventListener("click", async () => {
    const addresses = document.querySelector("#inpt");
    const chain = document.querySelector("#chain").value;
    const coin = document.getElementById("coin").value;

    await inptStringToArray(addresses.value);

    addresses.value = "";

    for (let address of amounts) {
        const amount = await getBalance(address, chain, coin);
        // if (!tableObject[address]) {
        //     tableObject[address] = [];
        // }
        // if (!tableObject[chain]) {
        //     tableObject[chain] = [];
        // }
        // if (!tableObject[coin]) {
        //     tableObject[coin] = [];
        // }
        // tableObject[address][chain][coin].amount = amount;
        // console.log(tableObject);
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
                const tbl = document.querySelector("#tbl");
                table.appendChild(tr);
                tbl.append(table);
            }
            const table = document.querySelector("table");
            const tr = document.createElement("tr");
            tr.innerHTML = ` <td> ${address} </td> <td> <b> ${amount} </td> </b>  <td> ${coin}</td> <td> ${chain}`;
            table.appendChild(tr);
            tableCreated = 1;
            btnCopyTable.classList.remove("dispNone");
            exportTable.classList.remove("dispNone");
        }
    }
    amounts = []
})

const tableToCSV = async () => {
    try {
        let csvData = [];

        const rows = document.querySelectorAll("tr");
        for (let row of rows) {
            let cols = row.querySelectorAll("th,td");
            let csvRow = []
            for (let col of cols) {
                csvRow.push(col.innerText);
            }
            csvData.push(csvRow.join(","));
        }
        csvData = csvData.join("\n");

        const blob = new Blob([csvData], { type: 'text/csv' });

        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'Coins.csv';

        link.style.display = "none";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        alert("Error " + error + " Occured");
    }
}

const copyEl = async () => {
    const elToBeCopied = document.querySelector('table');
    try {
        await navigator.clipboard.writeText(elToBeCopied.innerText);
        alert("Table copied to clipboard");
    } catch (err) {
        alert("Something went wrong");
    }
};

btnCopyTable.addEventListener('click', () => copyEl());
exportTable.addEventListener('click', () => tableToCSV());

const hreBtn = document.querySelector(".btn2");

hreBtn.addEventListener("click", () => {
    window.location.href = 'https://www.linkedin.com/in/awezmirza/';
})