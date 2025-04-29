import prisma from "../prisma/client";

// Step membuat akun
export const createAccount = async (name: string, email: string) => {
  // cek apakah emails udah dipakai
  const existing = await prisma.account.findUnique({
    where: { email },
  });

  if (existing) {
    throw new Error("Email sudah digunakan, silahkan gunakan email lain");
  }

  const newAccount = await prisma.account.create({
    data: { name, email },
  });

  return newAccount;
};

// Step cek balance
export const getAccountBalance = async (id: number) => {
  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    throw new Error(" Akun tidak ditemukan");
  }

  return { balance: account.balance };
};

// Step Update Saldo
export const depositToAccount = async (id: number, amount: number) => {
  if (amount <= 0) {
    throw new Error("Jumlah deposit harus lebih dari 0");
  }

  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    throw new Error(" Akun tidak ditemukan");
  }

  // ini update saldo
  const updated = await prisma.account.update({
    where: { id },
    data: {
      balance: {
        increment: amount,
      },
    },
  });

  // ini mencatat transaksi
  await prisma.transaction.create({
    data: {
      type: "DEPOSIT",
      amount,
      accountId: id,
    },
  });

  return { balance: updated.balance };
};

// Step Withdraw Saldo
export const withdrawFromAccount = async (id: number, amount: number) => {
  if (amount <= 0) {
    throw new Error("Jumlah withdraw harus lebih dari 0");
  }

  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    throw new Error("Akun tidak ditemukan");
  }

  if (account.balance < amount) {
    throw new Error("Saldo tidak mencukupi");
  }

  const updated = await prisma.account.update({
    where: { id },
    data: {
      balance: {
        decrement: amount,
      },
    },
  });

  await prisma.transaction.create({
    data: {
      type: "WITHDRAW",
      amount,
      accountId: id,
    },
  });

  return { balance: updated.balance };
};

export const transferToAnotherAccount = async (
  fromId: number,
  toId: number,
  amount: number
) => {
  if (amount <= 0) {
    throw new Error("Jumlah transfer harus lebih dari 0");
  }

  if (fromId === toId) {
    throw new Error("Tidak bisa transfer ke akun sendiri");
  }

  const fromAccount = await prisma.account.findUnique({
    where: { id: fromId },
  });
  const toAccount = await prisma.account.findUnique({
    where: { id: toId },
  });

  if (!fromAccount) throw new Error("Akun pengirim tidak ditemukan");
  if (!toAccount) throw new Error("Akun penerima tidak ditemukan");

  if (fromAccount.balance < amount) throw new Error("Saldo tidak mencukupi");

  // Transaksi ini secara atomic
  const [updatedFrom, updatedTo] = await prisma.$transaction([
    prisma.account.update({
      where: { id: fromId },
      data: { balance: { decrement: amount } },
    }),

    prisma.account.update({
      where: { id: toId },
      data: { balance: { increment: amount } },
    }),

    prisma.transaction.create({
      data: {
        type: "TRANSFER",
        amount,
        accountId: fromId,
        toAccountId: toId,
      },
    }),
  ]);

  return {
    fromBalance: updatedFrom.balance,
    toBalance: updatedTo.balance,
  };
};

export const getTransactionsByAccount = async (id: number) => {
  const account = await prisma.account.findUnique({
    where: { id },
  });

  if (!account) {
    throw new Error("Akun tidak ditemukan");
  }

  const transactions = await prisma.transaction.findMany({
    where: {
      OR: [
        {
          accountId: id,
        },
        {
          toAccountId: id,
        }, // ini untuk melihat transaksi masuk dari transfer
      ],
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return transactions;
};
