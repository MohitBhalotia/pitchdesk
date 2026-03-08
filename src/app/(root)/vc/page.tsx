import { redirect } from "next/navigation";

/**
 * /vc has no dedicated landing page; VC tools live under /dashboard (role-aware)
 * and /vc/pitches, /vc/incubations, /vc/bots. Redirect to dashboard so users
 * land in the app and can use the sidebar to reach VC sections.
 */
export default function VCPage() {
  redirect("/dashboard");
}
