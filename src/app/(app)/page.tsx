import { CreateLinkForm } from "@/components/forms/create-link-form";
import { UserLinks } from "@/components/user-links";

export default function Home() {
  return (
    <>
      <main className="my-4">
        <CreateLinkForm />
      </main>

      <section>
        <h2 className="text-lg font-bold">My links</h2>

        <UserLinks />
      </section>
    </>
  );
}
