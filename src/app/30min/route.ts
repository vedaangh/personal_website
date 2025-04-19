import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://cal.com/vedaangh/vedaanghrungta30min', { status: 302 });
} 