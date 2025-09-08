import { dbConnect } from '../../../lib/dbConnect'
import ImpactHeroSection from '@/lib/models/impactherosection'
import { NextResponse } from 'next/server'

// CORS preflight handler
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,DELETE,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type,Authorization',
    },
  })
}

// GET the single hero section (singleton)
export async function GET() {
  await dbConnect()
  const data = await ImpactHeroSection.findOne({})
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// UPSERT the single hero section
export async function POST(req) {
  await dbConnect()
  const body = await req.json()

  // Remove 'history' if present in body to avoid conflict
  const { history, ...updateData } = body

  // Upsert: update if exists, else create
  const updated = await ImpactHeroSection.findOneAndUpdate({}, updateData, { new: true, upsert: true })
  return NextResponse.json(updated, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// DELETE the single hero section
export async function DELETE() {
  await dbConnect()
  await ImpactHeroSection.deleteMany({})
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}
