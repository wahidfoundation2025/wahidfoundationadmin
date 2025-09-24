import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/user";
import Invite from "@/lib/models/invite";

import corsHeaders from "../../../layout";

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/users/:email
export async function GET(req, { params }) {
  await dbConnect();
  const { email } = await params;

  try {
    const userEmail = decodeURIComponent(email);
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("GET error:", error);
    return new Response(JSON.stringify({ message: "Failed to fetch user" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// PUT /api/users/:email
export async function PUT(req, { params }) {
  await dbConnect();
  const { email } = await params;

  try {
    const userEmail = decodeURIComponent(email);
    const body = await req.json();

    const updated = await User.findOneAndUpdate({ email: userEmail }, body, {
      new: true,
    });

    if (!updated) {
      return new Response(JSON.stringify({ message: "User not found" }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error("PUT error:", error);
    return new Response(JSON.stringify({ message: "Failed to update user" }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// DELETE /api/users/:email
export async function DELETE(req, { params }) {
  await dbConnect();
  const { email } = await params;

  try {
    const userEmail = decodeURIComponent(email);

    const deletedUser = await User.findOneAndDelete({ email: userEmail });
    const deletedInvite = await Invite.findOneAndDelete({ email: userEmail });

    if (!deletedUser && !deletedInvite) {
      return new Response(
        JSON.stringify({ message: "User not found in both collections" }),
        {
          status: 404,
          headers: corsHeaders,
        }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User and/or invite deleted successfully",
        userDeleted: !!deletedUser,
        inviteDeleted: !!deletedInvite,
      }),
      {
        status: 200,
        headers: corsHeaders,
      }
    );
  } catch (error) {
    console.error("DELETE error:", error);
    return new Response(
      JSON.stringify({ message: "Failed to delete user/invite" }),
      {
        status: 500,
        headers: corsHeaders,
      }
    );
  }
}
