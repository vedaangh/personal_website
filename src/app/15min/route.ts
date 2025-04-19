import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://cal.com/15minvedaanghrungta', { status: 302 });
} 