// One-off maintenance route: drops the stale unique index on Donor.pancardNumber
// that prevented creating donors without a PAN. Safe to call multiple times.
import { dbConnect } from "@/lib/dbConnect";
import Donor from "@/lib/models/donor";
import { corsHeaders } from "../../layout";

export async function GET() {
  await dbConnect();
  let dropped;
  try {
    await Donor.collection.dropIndex("pancardNumber_1");
    dropped = "pancardNumber_1 dropped";
  } catch (e) {
    dropped = "not-found-or-already-dropped: " + e.message;
  }
  const indexes = await Donor.collection.indexes();
  return new Response(JSON.stringify({ dropped, indexes }), {
    status: 200,
    headers: corsHeaders,
  });
}
