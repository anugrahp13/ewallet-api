import { Request, Response } from "express";
import { createAccount } from "../services/account.service";
import { getAccountBalance } from "../services/account.service";
import { depositToAccount } from "../services/account.service";
import { withdrawFromAccount } from "../services/account.service";
import { transferToAnotherAccount } from "../services/account.service";
import { getTransactionsByAccount } from "../services/account.service";
export const registerAccount = async (req: Request, res: Response) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: "Name dan Email wajib diisi" });
    }

    const account = await createAccount(name, email);
    return res.status(201).json(account);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const checkBalance = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const balance = await getAccountBalance(id);
    return res.json(balance);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const deposit = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { amount } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }
    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Amount harus berupa angka" });
    }

    const result = await depositToAccount(id, amount);
    return res.json(result);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
};

export const withdraw = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);
    const { amount } = req.body;

    if (isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    if (typeof amount !== "number") {
      return res.status(400).json({ message: "Amount harus berupa angka" });
    }

    const result = await withdrawFromAccount(id, amount);
    return res.json(result);
  } catch (error: any) {
    const message =
      error.message || "Saldo tidak mencukupi"
        ? "Saldo tidak mencukupi"
        : error.message;
    const status = message === "Saldo tidak mencukupi" ? 400 : 400;
    return res.status(400).json({ message });
  }
};

export const transfer = async (req: Request, res: Response) => {
  try {
    const fromId = parseInt(req.params.id);
    const { toAccountId, amount } = req.body;

    if (
      isNaN(fromId) ||
      typeof toAccountId !== "number" ||
      typeof amount !== "number"
    ) {
      return res.status(400).json({ message: "Data tidak valid" });
    }

    const result = await transferToAnotherAccount(fromId, toAccountId, amount);
    return res.json(result);
  } catch (error: any) {
    const message = error.message;
    const status =
      message === "Saldo tidak mencukupi" ||
      message.includes("tidak bisa") ||
      message.includes("lebih dari 0")
        ? 400
        : 404;
    return res.status(status).json({ message });
  }
};

export const getTransactions = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    if(isNaN(id)) {
      return res.status(400).json({ message: "ID tidak valid" });
    }

    const transactions = await getTransactionsByAccount(id);
    return res.json(transactions);
  } catch (error: any) {
    return res.status(400).json({ message: error.message });
  }
}
