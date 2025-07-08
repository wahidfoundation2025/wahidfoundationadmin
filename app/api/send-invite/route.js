import { dbConnect } from "@/lib/dbConnect";
import User from "@/lib/models/user"; // Adjust this path if needed

export async function POST(req) {
  const { email, role, access } = await req.json();

  await dbConnect();

  try {
    // Invite via Clerk
    const res = await fetch('https://api.clerk.com/v1/invitations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.CLERK_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email,
        redirect_url: 'https://wahidfoundationadmin.vercel.app/signup',
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      return new Response(JSON.stringify({ message: data.message || 'Failed to invite' }), {
        status: res.status,
      });
    }

    // Save user in MongoDB
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      await User.create({ email, role, access });
    }

    return new Response(JSON.stringify({ message: 'Invite sent and user saved.', data }), {
      status: 200,
    });

  } catch (error) {
    console.error('Invite error:', error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
    });
  }
}
