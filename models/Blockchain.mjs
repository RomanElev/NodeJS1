import { createHash } from "../utilities/crypto-lib.mjs";
import Block from "./Block.mjs";
import fs from "fs";

export default class Blockchain {
  constructor() {
    console.log("Blockchain constructor", process.env.DIFFICULTY);
    this.chain = [];
    this.createBlock(Date.now(), "0", "0", [], process.env.DIFFICULTY);
  }

  createBlock(
    timestamp,
    previousBlockHash,
    currentBlockHash,
    data,
    difficulty
  ) {
    const block = new Block(
      timestamp,
      this.chain.length + 1,
      previousBlockHash,
      currentBlockHash,
      data,
      difficulty
    );

    this.chain.push(block);

    return block;
  }
  getLastBlock() {
    return this.chain[this.chain.length - 1];
  }

  hashBlock(timestamp, previousBlockHash, currentBlockData, nonce, difficulty) {
    const stringToHash =
      timestamp.toString() +
      previousBlockHash +
      JSON.stringify(currentBlockData) +
      nonce +
      difficulty;
    const hash = createHash(stringToHash);
    return hash;
  }
  proofOfWork(previousBlockHash, data) {
    const lastBlock = this.getLastBlock();
    let difficulty, hash, timestamp;
    let nonce = 0;

    do {
      nonce++;
      timestamp = Date.now();

      difficulty = this.difficultyAdjustment(lastBlock, timestamp);
      hash = this.hashBlock(
        timestamp,
        previousBlockHash,
        data,
        nonce,
        difficulty
      );
    } while (hash.substring(0, difficulty) !== "0".repeat(difficulty));

    return { nonce, difficulty, timestamp };
  }

  difficultyAdjustment(lastBlock, timestamp) {
    const MINE_RATE = process.env.MINE_RATE;
    let { difficulty } = lastBlock;

    if (difficulty < 1) return 1;

    return timestamp - lastBlock.timestamp > MINE_RATE
      ? +difficulty + 1
      : +difficulty - 1;
  }
  writeBlockchainToFile() {
    fs.writeFile("blockchain.json", JSON.stringify(this.chain), (err) => {
      if (err) {
        console.error("Error: ", err);
      } else {
        console.log("Success!");
      }
    });
  }
}
