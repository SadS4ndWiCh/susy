import type { Metadata } from "next"
import Link from "next/link"

import { SignupForm } from "@/components/forms/signup-form"
import { OAuthMethods } from "@/components/oauth-methods"

export const metadata: Metadata = {
  title: "Sign up"
}

export default function Signup() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-xl font-bold">Create an account!</h1>
        <p className="text-balance text-muted-foreground">
          There&apos;s nothing better than scaring your friends with strange links. So create an account and do that.
        </p>
      </header>

      <OAuthMethods />

      <SignupForm />

      <footer>
        <Link href="/signin" className="underline underline-offset-4">
          Already have an account? Sign in
        </Link>
      </footer>
    </>
  )
}