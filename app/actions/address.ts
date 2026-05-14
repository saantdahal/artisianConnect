"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getAddresses() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  return await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

export async function addAddress(data: {
  fullName: string;
  phoneNumber: string;
  address: string;
  region: string;
  postcode?: string;
  label: string;
  isDefaultShipping: boolean;
  isDefaultBilling: boolean;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // If setting as default, unset others first
  if (data.isDefaultShipping) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefaultShipping: true },
      data: { isDefaultShipping: false },
    });
  }

  if (data.isDefaultBilling) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefaultBilling: true },
      data: { isDefaultBilling: false },
    });
  }

  await prisma.address.create({
    data: {
      ...data,
      userId: session.user.id,
    },
  });

  revalidatePath("/user/address-book");
}

export async function updateAddress(
  id: string,
  data: {
    fullName: string;
    phoneNumber: string;
    address: string;
    region: string;
    postcode?: string;
    label: string;
    isDefaultShipping: boolean;
    isDefaultBilling: boolean;
  }
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  // If setting as default, unset others first
  if (data.isDefaultShipping) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefaultShipping: true },
      data: { isDefaultShipping: false },
    });
  }

  if (data.isDefaultBilling) {
    await prisma.address.updateMany({
      where: { userId: session.user.id, isDefaultBilling: true },
      data: { isDefaultBilling: false },
    });
  }

  await prisma.address.update({
    where: { id, userId: session.user.id },
    data,
  });

  revalidatePath("/user/address-book");
}

export async function deleteAddress(id: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  await prisma.address.delete({
    where: { id, userId: session.user.id },
  });

  revalidatePath("/user/address-book");
}

export async function setDefaultAddress(
  id: string,
  type: "shipping" | "billing"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    throw new Error("Unauthorized");
  }

  const field = type === "shipping" ? "isDefaultShipping" : "isDefaultBilling";

  // Unset current default
  await prisma.address.updateMany({
    where: { userId: session.user.id, [field]: true },
    data: { [field]: false },
  });

  // Set new default
  await prisma.address.update({
    where: { id, userId: session.user.id },
    data: { [field]: true },
  });

  revalidatePath("/user/address-book");
}
