import { dbConnect } from '../../../lib/dbConnect'
import Donor from '../../../lib/models/donor'

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET,OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}

export async function GET() {
  await dbConnect()
  const donors = await Donor.find().sort({ createdAt: -1 })
  return new Response(JSON.stringify(donors), {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json',
    },
  })
}
