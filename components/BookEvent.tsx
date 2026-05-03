'use client';

import {useState} from "react";
import {createBooking} from "@/lib/actions/booking.actions";
import posthog from "posthog-js";

const BookEvent = ({ eventId, slug }: { eventId: string, slug: string;}) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        const { success } = await createBooking({ eventId, slug, email });

        if(success) {
            setSubmitted(true);
            posthog.capture('event_booked', { eventId, slug, email })
        } else {
            setError('Booking failed. You may have already registered for this event.');
            posthog.captureException('Booking creation failed')
        }
    }

    return (
        <div id="book-event">
            {submitted ? (
                <p className="text-sm">Thank you for signing up!</p>
            ): (
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email">Email Address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            placeholder="Enter your email address"
                            required
                        />
                    </div>

                    {error && <p className="text-sm text-red-400">{error}</p>}

                    <button type="submit">Submit</button>
                </form>
            )}
        </div>
    )
}
export default BookEvent
