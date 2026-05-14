"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

// Type definition for creating a payment option
export type PaymentOptionFormValues = {
  type: string; // "DIGITAL_WALLET" | "CREDIT_CARD" | "DEBIT_CARD"
  provider: string; // "ESEWA" | "KHALTI" | "VISA" | "MASTERCARD"
  accountName: string;
  accountNumber: string;
  expiryDate?: string;
  isDefault: boolean;
};

export async function addPaymentOption(data: PaymentOptionFormValues) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // TODO: PaymentOption model does not exist in Prisma Schema yet.
  // if (data.isDefault) {
  //   await prisma.paymentOption.updateMany({
  //     where: { userId: session.user.id, isDefault: true },
  //     data: { isDefault: false },
  //   });
  // }

  // await prisma.paymentOption.create({
  //   data: {
  //     ...data,
  //     userId: session.user.id,
  //   },
  // });

  revalidatePath("/user/payment-options");
}

export async function deletePaymentOption(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // TODO: PaymentOption model does not exist in Prisma Schema yet.
  // await prisma.paymentOption.delete({
  //   where: { id, userId: session.user.id },
  // });

  revalidatePath("/user/payment-options");
}

export async function setDefaultPaymentOption(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // TODO: PaymentOption model does not exist in Prisma Schema yet.
  // await prisma.paymentOption.updateMany({
  //   where: { userId: session.user.id, isDefault: true },
  //   data: { isDefault: false },
  // });

  // await prisma.paymentOption.update({
  //   where: { id, userId: session.user.id },
  //   data: { isDefault: true },
  // });

  revalidatePath("/user/payment-options");
}

export async function getPaymentOptions() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // TODO: PaymentOption model does not exist in Prisma Schema yet.
  return [];
  // return await prisma.paymentOption.findMany({
  //   where: {
  //     userId: session.user.id,
  //   },
  //   orderBy: {
  //     createdAt: "desc",
  //   },
  // });
}
