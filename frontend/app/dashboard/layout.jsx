import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardWrapper from "./components/DashboardWrapper";

export default async function DashboardLayout({ children }) {
  const session = await auth();

  if (!session) {
    redirect("/");
  }

  return <DashboardWrapper>{children}</DashboardWrapper>;
}


