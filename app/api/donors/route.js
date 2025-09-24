import { dbConnect } from '../../../lib/dbConnect'
import Donor from '../../../lib/models/donor'

import { corsHeaders } from '../../layout'

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  })
}

export async function GET() {
  await dbConnect()
  const donors = await Donor.find().sort({ createdAt: -1 })
  return new Response(JSON.stringify(donors), {
    status: 200,
    headers: corsHeaders,
  })
}
