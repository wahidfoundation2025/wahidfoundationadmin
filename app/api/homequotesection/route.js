import {dbConnect} from '../../../lib/dbConnect'
import Quote from '../../../lib/models/homequotesection'
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

// GET the single quote (singleton)
export async function GET() {
  await dbConnect()
  const data = await Quote.findOne({}).sort({ createdAt: -1 })
  return NextResponse.json(data, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// UPSERT the single quote
export async function POST(req) {
  await dbConnect()
  const body = await req.json()
  // Remove all existing quotes before creating new
  await Quote.deleteMany({})
  const created = await Quote.create(body)
  return NextResponse.json(created, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}

// DELETE all quotes
export async function DELETE() {
  await dbConnect()
  await Quote.deleteMany({})
  return NextResponse.json({ success: true }, {
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  })
}
