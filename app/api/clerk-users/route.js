import { NextResponse } from 'next/server';

export async function GET(request) {
  // (optional: get query params from URL if needed)
  // const { searchParams } = new URL(request.url);
  // const limit = searchParams.get('limit') || 5;
  // const offset = searchParams.get('offset') || 0;

  const response = await fetch('https://api.clerk.com/v1/users?limit=5&offset=0', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.CLERK_SECRET_KEY}`
    }
  });

  const data = await response.json();

  return NextResponse.json(data, { status: response.status });
}
