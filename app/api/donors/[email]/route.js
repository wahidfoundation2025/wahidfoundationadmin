import { dbConnect } from '@/lib/dbConnect';
import Donor from '@/lib/models/donor';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}

export async function GET(req, { params }) {
  const { email } = params; // get email from URL
  await dbConnect();

  try {
    const donor = await Donor.findOne({ email }).populate('donations').populate('projectsDonatedTo');
    if (!donor) {
      return new Response(JSON.stringify({ message: 'Donor not found' }), {
        status: 404,
        headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify(donor), {
      status: 200,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: { 'Access-Control-Allow-Origin': '*', 'Content-Type': 'application/json' },
    });
  }
}
