// app/api/cms/footer/route.js
import { dbConnect } from '@/lib/dbConnect'
import FooterSettings from '@/lib/models/footerSettings'
import { NextResponse } from 'next/server'

// CORS Preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  });
}

// GET Footer Settings (singleton)
export async function GET() {
  await dbConnect();
  const data = await FooterSettings.findOne({});
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// POST (Upsert) Footer Settings
export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const updated = await FooterSettings.findOneAndUpdate({}, body, { new: true, upsert: true });
  return NextResponse.json(updated, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// DELETE Footer Settings (reset)
export async function DELETE() {
  await dbConnect();
  await FooterSettings.deleteMany({});
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  });
}
