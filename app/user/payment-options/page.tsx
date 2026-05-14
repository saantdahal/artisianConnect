import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { PaymentOptions } from "@/components/user/PaymentOptions";

export default async function PaymentOptionsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    redirect("/");
  }

  return (
    <div className="flex-1">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">Payment Options</h1>
      </div>
      <PaymentOptions />
    </div>
  );
}
