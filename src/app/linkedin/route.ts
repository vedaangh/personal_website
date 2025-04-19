import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.redirect('https://linkedin.com/in/vedaangh', { status: 302 });
} 