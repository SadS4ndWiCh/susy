import { CreateLinkForm } from "@/components/create-link-form";
import { LogoutButton } from "@/components/logout-button";
import { UserLinks } from "@/components/user-links";

export default function Home() {
  return (
    <>
      <header className="max-w-xl mx-auto mt-8">
        <h1 className="text-xl font-bold">susy.</h1>
        <p className="text-muted-foreground">
          Already have many URL shortener boring solutions, so aiming for a more 
          funny one, now you can create a suspicious link to share.
        </p>

        <LogoutButton />
      </header>

      <main className="max-w-xl mx-auto my-4">
        <CreateLinkForm />
      </main>

      <section className="max-w-xl mx-auto">
        <h2 className="text-lg font-bold">My links</h2>

        <UserLinks />
      </section>
    </>
  );
}
