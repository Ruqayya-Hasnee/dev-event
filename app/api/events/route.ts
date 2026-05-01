import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Event from '@/database/event.model';

export async function GET() {
  try {
    await connectToDatabase();

    const events = await Event.find().sort({ date: 1 }).lean();

    return NextResponse.json(
      { success: true, events },
      { status: 200 }
    );
  } catch (e) {
    return NextResponse.json(
      { success: false, message: e instanceof Error ? e.message : 'Failed to fetch events' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();

    const event = await Event.create(body);

    return NextResponse.json(
      { success: true, message: 'Event created successfully', event },
      { status: 201 }
    );
  } catch (e) {
    // Mongoose validation errors get a 400; everything else is a 500
    const isValidationError =
      e instanceof Error && e.name === 'ValidationError';

    return NextResponse.json(
      {
        success: false,
        message: e instanceof Error ? e.message : 'Failed to create event',
      },
      { status: isValidationError ? 400 : 500 }
    );
  }
}
