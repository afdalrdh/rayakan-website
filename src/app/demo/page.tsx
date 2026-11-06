import { Suspense } from "react";
import { LiveSite } from "@/components/LiveSite";

// Same invitation as /tema/arya: keep it out of search results to avoid a duplicate.
export const metadata = { title: { absolute: "The Wedding of Arya & Almalia · Rayakan.my.id" }, robots: { index: false, follow: true }, alternates: { canonical: "/tema/arya" } };

export default function DemoPage() {
  return (
    <Suspense>
      <LiveSite />
    </Suspense>
  );
}
