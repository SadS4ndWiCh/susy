import { CreateLinkForm } from "@/components/forms/create-link-form";
import { UserLinks } from "@/components/user-links";
import { UserMenu } from "@/components/user-menu";

export default function Home() {
  return (
    <>
      <header className="flex justify-between gap-4 max-w-xl mx-auto">
        <div>
          <h1 className="text-xl font-bold">susy.</h1>
          <p className="text-muted-foreground">
            Already have many URL shortener boring solutions, so aiming for a more 
            funny one, now you can create a suspicious link to share.
          </p>
        </div>

        <UserMenu />
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
