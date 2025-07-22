import { dbConnect } from '../../../lib/dbConnect'
import HomeHeroSection from '../../../lib/models/homeherosection'
import { NextResponse } from 'next/server'

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': 'https://www.wahid.org.in',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  })
}

// GET the single hero section (singleton)
export async function GET() {
  await dbConnect()
  const data = await HomeHeroSection.findOne({})
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': 'https://www.wahid.org.in',
    },
  })
}

// UPSERT the single hero section
export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  // Upsert: update if exists, else create
  const updated = await HomeHeroSection.findOneAndUpdate({}, body, { new: true, upsert: true })
  return NextResponse.json(updated, {
    headers: {
      'Access-Control-Allow-Origin': 'https://www.wahid.org.in',
    },
  })
}

// DELETE the single hero section
export async function DELETE() {
  await dbConnect()
  await HomeHeroSection.deleteMany({})
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': 'https://www.wahid.org.in',
    },
  })
}
