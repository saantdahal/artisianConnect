import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { AddressBook } from "@/components/user/AddressBook";

export default async function AddressBookPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  const addresses = await prisma.address.findMany({
    where: {
      userId: session.user.id,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">Address Book</h1>
        <div className="text-sm">
          {/* <span className="text-teal-500 cursor-pointer hover:underline">
            Make default shipping address
          </span>
          <span className="mx-2 text-gray-300">|</span>
          <span className="text-teal-500 cursor-pointer hover:underline">
            Make default billing address
          </span> */}
        </div>
      </div>
      <AddressBook initialAddresses={addresses} />
    </div>
  );
}
