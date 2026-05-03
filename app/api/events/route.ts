import {NextRequest, NextResponse} from "next/server";
import { v2 as cloudinary } from 'cloudinary';

import connectDB from "@/lib/mongodb";
import Event from '@/database/event.model';

export async function POST(req: NextRequest) {
    try {
        await connectDB();

        const urlMatch = process.env.CLOUDINARY_URL?.match(/^cloudinary:\/\/([^:]+):([^@]+)@(.+)$/);
        if (!urlMatch) return NextResponse.json({ message: 'Cloudinary not configured' }, { status: 500 });
        cloudinary.config({ api_key: urlMatch[1], api_secret: urlMatch[2], cloud_name: urlMatch[3], secure: true });

        const formData = await req.formData();
        const event: Record<string, FormDataEntryValue> = Object.fromEntries(formData.entries());

        const file = formData.get('image') as File;

        if(!file) return NextResponse.json({ message: 'Image file is required'}, { status: 400 })

        let tags: string[], agenda: string[];
        try {
            tags = JSON.parse(formData.get('tags') as string);
            agenda = JSON.parse(formData.get('agenda') as string);
        } catch {
            return NextResponse.json({ message: 'Invalid tags or agenda format' }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: 'image', folder: 'DevEvent' }, (error, results) => {
                if(error) return reject(error);

                resolve(results);
            }).end(buffer);
        });

        event.image = (uploadResult as { secure_url: string }).secure_url;

        const createdEvent = await Event.create({
            ...event,
            tags: tags,
            agenda: agenda,
        });

        return NextResponse.json({ message: 'Event created successfully', event: createdEvent }, { status: 201 });
    } catch (e) {
        console.error(e);
        const errMsg = e instanceof Error ? e.message : (e as any)?.message ?? String(e);
        return NextResponse.json({ message: 'Event Creation Failed', error: errMsg }, { status: 500 })
    }
}

export async function GET() {
    try {
        await connectDB();

        const events = await Event.find().sort({ createdAt: -1 }).lean();

        return NextResponse.json({ message: 'Events fetched successfully', events }, { status: 200 });
    } catch (e) {
        return NextResponse.json({ message: 'Event fetching failed', error: e }, { status: 500 });
    }
}
