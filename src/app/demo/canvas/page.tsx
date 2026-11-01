import { redirect } from "next/navigation";

/** Old prototype path, kept so existing links keep working. */
export default function OldCanvas() {
  redirect("/canvas");
}
