import type { Metadata } from "next"
import Link from "next/link"

import { SigninForm } from "@/components/forms/signin-form"

export const metadata: Metadata = {
  title: "Sign in"
}

export default function Signin() {
  return (
    <>
      <header>
        <h1 className="text-xl font-bold">Welcome back!</h1>
        <p className="text-balance text-muted-foreground">
          Hurry up and enter your email and password to continue sharing suspicous things
        </p>
      </header>

      <SigninForm />

      <footer>
        <Link href="/signup" className="underline underline-offset-4">
          Don&apos;t have an account? Sign up
        </Link>
      </footer>
    </>
  )
}