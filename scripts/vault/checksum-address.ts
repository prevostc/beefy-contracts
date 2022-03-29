import { web3 } from "hardhat";

const inAddr = "0x3a5252cED60Dc299f4Cc037cF4a6DCD90609D7F7"; //process.argv[1];
const outAddr = web3.utils.toChecksumAddress(inAddr);

console.log("Addr: " + inAddr);
console.log("Checksummed address: " + outAddr);
