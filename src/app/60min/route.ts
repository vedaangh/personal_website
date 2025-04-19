import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://cal.com/vedaangh/ytxis', { status: 302 });
} 