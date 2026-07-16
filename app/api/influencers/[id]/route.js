import { dbConnect } from "@/lib/dbConnect";
import Influencer from "@/lib/models/influencer";
import { corsHeaders } from "../../../layout";

export async function OPTIONS() {
  return new Response(null, { status: 204, headers: corsHeaders });
}

export async function PUT(req, props) {
  const { params } = await props;
  await dbConnect();
  const body = await req.json();
  // Do not allow changing the code (it's baked into shared links).
  delete body.code;
  const updated = await Influencer.findByIdAndUpdate(params.id, body, {
    new: true,
  });
  return new Response(JSON.stringify(updated), {
    status: 200,
    headers: corsHeaders,
  });
}

export async function DELETE(req, props) {
  const { params } = await props;
  await dbConnect();
  await Influencer.findByIdAndDelete(params.id);
  return new Response(JSON.stringify({ message: "Influencer deleted" }), {
    status: 200,
    headers: corsHeaders,
  });
}
