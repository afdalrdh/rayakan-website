import { permanentRedirect } from "next/navigation";

/** Reviews now live on the home page (navbar "Ulasan" scrolls there); keep old links working. */
export default function ReviewsPage() {
  permanentRedirect("/#ulasan");
}
