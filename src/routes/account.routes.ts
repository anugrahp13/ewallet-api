import express from "express";
import {
  deposit,
  getTransactions,
  registerAccount,
  transfer,
  withdraw,
} from "../controllers/account.controller";
import { checkBalance } from "../controllers/account.controller";

const router = express.Router();

router.post("/accounts", registerAccount);
router.get("/accounts/:id/balance", checkBalance);
router.post("/accounts/:id/deposit", deposit);
router.post("/accounts/:id/withdraw", withdraw);
router.post("/accounts/:id/transfer", transfer);
router.get("/accounts/:id/transactions", getTransactions);
export default router;
