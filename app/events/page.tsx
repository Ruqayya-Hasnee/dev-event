import EventCard from '@/components/EventCard';
import { getAllEvents } from '@/lib/actions/event.actions';
import { IEvent } from '@/database';

export default async function EventsPage() {
  const events: IEvent[] = await getAllEvents();

  return (
    <section className="max-w-6xl mx-auto py-10">
      <h1>All Events</h1>

      {events.length === 0 ? (
        <div className="mt-10 text-center">
          <p className="text-light-100">No events found. Create one to get started!</p>
        </div>
      ) : (
        <ul className="events mt-10">
          {events.map((event: IEvent) => (
            <li key={event.slug} className="list-none">
              <EventCard {...event} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
