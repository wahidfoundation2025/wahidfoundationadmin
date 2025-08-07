import { dbConnect } from '@/lib/dbConnect';
import User from '@/lib/models/user';
import Invite from '@/lib/models/invite';

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

// Handle preflight requests
export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

// GET /api/users/:email
export async function GET(_, { params }) {
  await dbConnect();

  try {
    const email = decodeURIComponent(params.email);
    const user = await User.findOne({ email });

    if (!user) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(user), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('GET error:', error);
    return new Response(JSON.stringify({ message: 'Failed to fetch user' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// PUT /api/users/:email
export async function PUT(req, { params }) {
  await dbConnect();

  try {
    const email = decodeURIComponent(params.email);
    const body = await req.json();

    const updated = await User.findOneAndUpdate(
      { email },
      body,
      { new: true }
    );

    if (!updated) {
      return new Response(JSON.stringify({ message: 'User not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(updated), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('PUT error:', error);
    return new Response(JSON.stringify({ message: 'Failed to update user' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

// DELETE /api/users/:email
export async function DELETE(_, { params }) {
  await dbConnect();

  try {
    const email = decodeURIComponent(params.email);

    const deletedUser = await User.findOneAndDelete({ email });
    const deletedInvite = await Invite.findOneAndDelete({ email });

    if (!deletedUser && !deletedInvite) {
      return new Response(JSON.stringify({ message: 'User not found in both collections' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify({
      message: 'User and/or invite deleted successfully',
      userDeleted: !!deletedUser,
      inviteDeleted: !!deletedInvite,
    }), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error('DELETE error:', error);
    return new Response(JSON.stringify({ message: 'Failed to delete user/invite' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
