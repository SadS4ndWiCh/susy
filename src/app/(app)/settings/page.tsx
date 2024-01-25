import { type Metadata } from "next";

import { UserDetails } from "@/components/user-details";
import { UpdateUserForm } from "@/components/forms/update-user-form";
import { DeleteUserForm } from "@/components/forms/delete-user-form";

export const metadata: Metadata = {
  title: "Settings"
}

export default function Settings() {
  return (
    <>
      <section>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p>Your account details</p>
      </section>

      <section className="space-y-4 mt-8">
        <UpdateUserForm />

        <UserDetails />

        <DeleteUserForm />
      </section>
    </>
  )
}