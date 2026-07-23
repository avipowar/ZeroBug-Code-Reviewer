"use server";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export async function signInWithGithub(formdata: FormData) {
  const callBack = formdata.get("callbackUrl");

  // Better Auth do github login
  // todo : fic callback later
  const result = await auth.api.signInSocial({
    body: {
      provider: "github",
      callbackURL: "/dashboard",
    },
    headers: await headers(),
  });

  if (result.url) {
    redirect(result.url);
  }
}
