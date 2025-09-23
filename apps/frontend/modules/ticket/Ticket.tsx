"use client"
import React, { useState } from 'react';
import { createTicket } from '@/lib/services/ticket';
import { Button } from '@/modules/ui/button';

export default function ContactUs() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await createTicket(form);
      setSuccess(true);
      setForm({ name: '', email: '', phone: '', message: '' });
    } catch (err: any) {
      setError('Failed to submit ticket. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 md:p-12 font-sans">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Contact Form */}
        <div className="space-y-8">
          <h2 className="text-3xl font-semibold text-gray-900">Contact Us</h2>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block text-base font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="name"
                type="text"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="Email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-base font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                placeholder="Phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {/* Message Field */}
            <div>
              <label htmlFor="message" className="block text-base font-medium text-gray-700 mb-1">
                Message
              </label>
              <textarea
                id="message"
                rows={5}
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            </div>

            {success && <div className="text-green-600">Your message has been sent!</div>}
            {error && <div className="text-red-600">{error}</div>}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Submitting...' : 'SUBMIT'}
            </Button>
          </form>
        </div>

        {/* Contact Info Panel */}
        <div className="bg-gray-50 rounded-lg p-6 space-y-6">
          <h2 className="text-3xl font-semibold text-gray-900">CROWNUP ONLINE</h2>
          <p className="text-gray-700 text-sm leading-relaxed">
            For any inquiries, please send us a message and we will reply to you as soon as possible. We would like to remind you that you should not send or provide your card details via e-mail or social networks.
          </p>

          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-800">⭑ MONDAY - SATURDAY</h3>
              <p className="text-gray-600">09:00 - 18:00</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">📞 PHONE</h3>
              <p className="text-gray-600">0117 447 447</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">📍 ADDRESS</h3>
              <p className="text-gray-600">NO 405, HIGH LEVEL RD, NUPEGODA.</p>
            </div>

            <div>
              <h3 className="font-semibold text-gray-800">📧 EMAIL</h3>
              <p className="text-gray-600">CROWNUP.LK</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


