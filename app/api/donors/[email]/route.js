import { dbConnect } from '@/lib/dbConnect';
import Donor from '@/lib/models/donor';
import donation from '@/lib/models/donation';
import project from '@/lib/models/Project';

import { corsHeaders } from '../../../layout';

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

export async function GET(req, { params }) {
  const { email } = params;
  await dbConnect();

  try {
    const donor = await Donor.findOne({ email })
      .populate('donations')
      .populate('projectsDonatedTo');

    if (!donor) {
      return new Response(JSON.stringify({ message: 'Donor not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }

    return new Response(JSON.stringify(donor), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ message: 'Server error' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function POST(req, { params }) {
  const { email } = params;
  await dbConnect();
  const body = await req.json();

  try {
    const existing = await Donor.findOne({ email });
    if (existing) {
      return new Response(JSON.stringify(existing), {
        status: 200,
        headers: corsHeaders,
      });
    }

    const donor = await Donor.create(body);
    return new Response(JSON.stringify(donor), {
      status: 201,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Error creating donor' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}

export async function PUT(req, { params }) {
  const { email } = params;
  await dbConnect();
  const body = await req.json();

  try {
    const donor = await Donor.findOneAndUpdate({ email }, body, { new: true });
    if (!donor) {
      return new Response(JSON.stringify({ message: 'Donor not found' }), {
        status: 404,
        headers: corsHeaders,
      });
    }
    return new Response(JSON.stringify(donor), {
      status: 200,
      headers: corsHeaders,
    });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ message: 'Error updating donor' }), {
      status: 500,
      headers: corsHeaders,
    });
  }
}
