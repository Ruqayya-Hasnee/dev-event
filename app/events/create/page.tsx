'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    overview: '',
    venue: '',
    location: '',
    date: '',
    time: '',
    mode: 'online',
    audience: '',
    organizer: '',
    tags: '',
    agenda: '',
    image: null as File | null,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, image: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const form = new FormData();
      form.append('title', formData.title);
      form.append('description', formData.description);
      form.append('overview', formData.overview);
      form.append('venue', formData.venue);
      form.append('location', formData.location);
      form.append('date', formData.date);
      form.append('time', formData.time);
      form.append('mode', formData.mode);
      form.append('audience', formData.audience);
      form.append('organizer', formData.organizer);
      form.append('tags', JSON.stringify(formData.tags.split(',').map((t) => t.trim()).filter(Boolean)));
      form.append('agenda', JSON.stringify(formData.agenda.split('\n').map((a) => a.trim()).filter(Boolean)));
      
      if (formData.image) {
        form.append('image', formData.image);
      }

      const response = await fetch('/api/events', {
        method: 'POST',
        body: form,
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type') ?? '';
        if (contentType.includes('application/json')) {
          const result = await response.json();
          throw new Error(result.error || result.message || 'Failed to create event');
        }
        throw new Error(`Server error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();
      router.push(`/events/${result.event.slug}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="max-w-2xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8">Create Event</h1>

      {error && (
        <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-6">
        {/* Title */}
        <div>
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            required
            placeholder="Event title"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-2">Description *</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            required
            placeholder="Detailed description of the event"
            rows={4}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Overview */}
        <div>
          <label className="block text-sm font-medium mb-2">Overview *</label>
          <textarea
            name="overview"
            value={formData.overview}
            onChange={handleInputChange}
            required
            placeholder="Brief overview (max 500 characters)"
            rows={3}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-2">Event Image *</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Venue */}
        <div>
          <label className="block text-sm font-medium mb-2">Venue *</label>
          <input
            type="text"
            name="venue"
            value={formData.venue}
            onChange={handleInputChange}
            required
            placeholder="Event venue"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Location */}
        <div>
          <label className="block text-sm font-medium mb-2">Location *</label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            required
            placeholder="City/Region"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Date *</label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Time */}
        <div>
          <label className="block text-sm font-medium mb-2">Time *</label>
          <input
            type="time"
            name="time"
            value={formData.time}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Mode */}
        <div>
          <label className="block text-sm font-medium mb-2">Mode *</label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          >
            <option value="online">Online</option>
            <option value="offline">Offline</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>

        {/* Audience */}
        <div>
          <label className="block text-sm font-medium mb-2">Target Audience *</label>
          <input
            type="text"
            name="audience"
            value={formData.audience}
            onChange={handleInputChange}
            required
            placeholder="e.g., Beginners, Experienced Developers"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Organizer */}
        <div>
          <label className="block text-sm font-medium mb-2">Organizer *</label>
          <input
            type="text"
            name="organizer"
            value={formData.organizer}
            onChange={handleInputChange}
            required
            placeholder="Organization name"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium mb-2">Tags (comma-separated) *</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleInputChange}
            required
            placeholder="e.g., javascript, web, react"
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Agenda */}
        <div>
          <label className="block text-sm font-medium mb-2">Agenda (one per line) *</label>
          <textarea
            name="agenda"
            value={formData.agenda}
            onChange={handleInputChange}
            required
            placeholder="Opening remarks&#10;Keynote talk&#10;Networking&#10;Closing"
            rows={5}
            className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-primary text-primary-foreground px-6 py-3 rounded-md font-semibold hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </section>
  );
}
