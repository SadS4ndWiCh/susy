import { CreateLinkForm } from "@/components/forms/create-link-form";
import { UserLinks } from "@/components/user-links";
import { UserMenu } from "@/components/user-menu";

export default function Home() {
  return (
    <>
      <header className="flex items-center justify-between gap-4 max-w-xl mx-auto">
        <h1 className="text-xl font-bold">susy.</h1>

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
