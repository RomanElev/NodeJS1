import express from "express";
import {
  createBlock,
  getBlockchain,
} from "../controllers/blockchain-controller.mjs";

const router = express.Router();

router.route("/").get(getBlockchain);
router.route("/mine").post(createBlock);

export default router;
