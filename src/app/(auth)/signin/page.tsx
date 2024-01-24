import type { Metadata } from "next"
import Link from "next/link"

import { SigninForm } from "@/components/forms/signin-form"
import { OAuthMethods } from "@/components/oauth-methods"

export const metadata: Metadata = {
  title: "Sign in"
}

export default function Signin() {
  return (
    <>
      <header className="mb-8">
        <h1 className="text-xl font-bold">Welcome back!</h1>
        <p className="text-balance text-muted-foreground">
          Hurry up and enter your email and password to continue sharing suspicous things
        </p>
      </header>

      <OAuthMethods />

      <SigninForm />

      <footer>
        <Link href="/signup" className="underline underline-offset-4">
          Don&apos;t have an account? Sign up
        </Link>
      </footer>
    </>
  )
}