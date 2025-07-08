import { dbConnect } from '../../../lib/dbConnect'
import Donation from '../../../lib/models/donation'

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET() {
  await dbConnect()
  const donations = await Donation.find().sort({ createdAt: -1 })
  return new Response(JSON.stringify(donations), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}

export async function POST(req) {
  await dbConnect()
  const data = await req.json()
  const donation = await Donation.create(data)
  return new Response(JSON.stringify(donation), {
    status: 201,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
