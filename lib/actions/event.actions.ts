'use server';

import Event, { IEvent } from '@/database/event.model';
import connectDB from "@/lib/mongodb";

export const getAllEvents = async (): Promise<IEvent[]> => {
    try {
        await connectDB();
        return await Event.find().sort({ createdAt: -1 }).lean<IEvent[]>();
    } catch {
        return [];
    }
};

export const getEventBySlug = async (slug: string): Promise<IEvent | null> => {
    try {
        await connectDB();
        return await Event.findOne({ slug }).lean<IEvent>();
    } catch {
        return null;
    }
};

export const getSimilarEventsBySlug = async (slug: string): Promise<IEvent[]> => {
    try {
        await connectDB();
        const event = await Event.findOne({ slug }).lean<IEvent>();
        if (!event) return [];

        return await Event.find({ _id: { $ne: event._id }, tags: { $in: event.tags } }).lean<IEvent[]>();
    } catch {
        return [];
    }
}
