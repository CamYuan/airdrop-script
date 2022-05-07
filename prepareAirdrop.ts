
import * as web3 from '@solana/web3.js';
import * as anchor from "@project-serum/anchor";
import { assert } from 'console';
import * as splToken from "@solana/spl-token";
import { token } from '@project-serum/anchor/dist/cjs/utils';
import * as fs from 'fs';

const TOKEN_TO_SEND = "ApeWLUZp1WGZdYnFEVubpTEzaNg2cpw182DKitLsyuRd";
const AMOUNT_TO_SEND = 3; // including decimans
const WHITELIST_FILE = 'Entrepreneur_WL.txt';

export const PROGRESS_FILE_PATH = "./progress.json";



export class TokenInfo {
    discordUser: string | undefined;
    owner: string | undefined;
    sendableTokenMint: string | undefined;
    sendableAmount: number | undefined;
    txid: string | undefined;
    successTxn: string | undefined;
    errorTxn: string | undefined;

    constructor(discordUser: string, ownerWallet: string) {
        this.discordUser = discordUser;
        this.owner = ownerWallet;
    }

}

export function writeJson(data: TokenInfo[]){
    let json = JSON.stringify(data);
    fs.writeFileSync(PROGRESS_FILE_PATH, json);
}

export function readJson(): TokenInfo[] {
    return JSON.parse(fs.readFileSync(PROGRESS_FILE_PATH).toString());
}



function prepareSend(data: TokenInfo[]){
    data.forEach(element => {
        element.sendableAmount = AMOUNT_TO_SEND;
        element.sendableTokenMint = TOKEN_TO_SEND;
    });
    return data;
}

async function main(){


    const rpcHost = "https://ssc-dao.genesysgo.net/"
    const c = new anchor.web3.Connection(rpcHost);
    let allInfo: TokenInfo[] = [];

    const file = fs.readFileSync(WHITELIST_FILE,'utf8').toString().split("\n");
    for(let i = 1; i < file.length; i++) {
        // console.log(file[i]);
        const record = file[i].split(';');
        // console.log(record[1], record[2]);
        const data = new TokenInfo(record[1], record[2]);
        allInfo.push(data);

    }
    
    allInfo = prepareSend(allInfo);


    if(!fs.existsSync(PROGRESS_FILE_PATH)){
        writeJson(allInfo);
        console.log("file saved");
    }

    
    // writeJson(allInfo);

    console.log("DONE");
}

if (require.main === module) {
    main();
}
