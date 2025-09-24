// app/api/invites/[email]/route.js
import { dbConnect } from "@/lib/dbConnect";
import Invite from "@/lib/models/invite";

import { corsHeaders } from "../../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// DELETE /api/invites/:email
export async function DELETE(_, { params }) {
  await dbConnect();

  try {
    const email = decodeURIComponent(params.email);
    const deleted = await Invite.findOneAndDelete({ email });

    if (!deleted) {
      return new Response(JSON.stringify({ message: "Invite not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(
      JSON.stringify({ message: "Invite deleted successfully" }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("DELETE /api/invites error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete invite" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
