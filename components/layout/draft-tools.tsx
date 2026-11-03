import { VisualEditing } from "next-sanity/visual-editing";
import { draftMode } from "next/headers";
import { redirect } from "next/navigation";

async function exitPreview() {
  "use server";
  const draft = await draftMode();
  draft.disable();
  redirect("/");
}

export async function DraftTools() {
  const { isEnabled } = await draftMode();
  if (!isEnabled) return null;

  return (
    <>
      <aside role="status" className="fixed bottom-4 left-4 z-50 flex items-center gap-3 rounded-full bg-forest px-5 py-2 text-sm text-white">
        Mode pratinjau draf
        <form action={exitPreview}>
          <button type="submit" className="min-h-11 font-semibold text-spark underline underline-offset-4">
            Keluar
          </button>
        </form>
      </aside>
      <VisualEditing />
    </>
  );
}
