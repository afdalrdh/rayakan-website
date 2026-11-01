import { Suspense } from "react";
import { LiveSite } from "@/components/LiveSite";

export const metadata = { title: "The Wedding of Arya & Almalia · Rayakan.my.id" };

export default function DemoPage() {
  return (
    <Suspense>
      <LiveSite />
    </Suspense>
  );
}
