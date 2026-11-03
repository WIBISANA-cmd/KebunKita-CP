import { connection } from "next/server";

// Used by the Docker HEALTHCHECK, so it must answer without calling Sanity.
export async function GET() {
  await connection();
  return Response.json({ status: "ok" });
}
