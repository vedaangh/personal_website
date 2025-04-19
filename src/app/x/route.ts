import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://x.com/vedaangh', { status: 302 });
} 