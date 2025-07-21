import { useState } from 'react';

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-16">

        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-black uppercase mb-8">Contact Us</h1>
          <div className="text-black space-y-8">
            <div className="space-y-2">
              <h2 className="text-base font-bold uppercase">CROWN UP</h2>
              <p className="text-sm leading-relaxed">
                For any inquiries, please send us a message and we will reply to you as soon as possible. We would like to 
                remind you that you should not send or provide your card details via e-mail or social networks.
              </p>
            </div>

            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-base font-bold uppercase">MONDAY - SATURDAY</span>
                <span className="text-sm">09:00 - 18:00</span>
              </div>
            </div>

            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-base font-bold uppercase">PHONE</span>
                <span className="text-sm">0112 456 789</span>
              </div>
            </div>

            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-base font-bold uppercase">ADDRESS</span>
              </div>
            </div>

            <div>
              <div className="flex flex-col space-y-1">
                <span className="text-base font-bold uppercase">EMAIL</span>
                <span className="text-sm">crownup.lk</span>
              </div>
            </div>
          </div>
        </div>


        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-sm placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-sm placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 text-sm placeholder-gray-400 focus:outline-none"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Message"
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 text-sm placeholder-gray-400 focus:outline-none resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-4 text-sm uppercase font-bold hover:bg-gray-900 transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
