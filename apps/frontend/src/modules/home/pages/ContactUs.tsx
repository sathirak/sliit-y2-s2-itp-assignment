import { useState, type JSX } from 'react';

const ClockIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"/>
    <path fill="currentColor" d="M13 7h-2v6h6v-2h-4z"/>
  </svg>
);

const FacebookIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12z"/>
  </svg>
);

const InstagramIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
  </svg>
);

const TikTokIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M19.589 6.686a4.793 4.793 0 0 1-3.77-4.245V2h-3.445v13.672a2.896 2.896 0 0 1-5.201 1.743l-.002-.001.002.001a2.895 2.895 0 0 1 3.183-4.51v-3.5a6.329 6.329 0 0 0-5.394 10.692 6.33 6.33 0 0 0 10.857-4.424V8.687a8.182 8.182 0 0 0 4.773 1.526V6.79a4.831 4.831 0 0 1-1.003-.104z"/>
  </svg>
);

const WhatsAppIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z"/>
  </svg>
);

const YouTubeIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="currentColor" d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M27.308 20.266l-2.224-2.224c-1.201-1.201-3.15-1.201-4.351 0l-1.571 1.571c-.147.147-.345.229-.553.229-.208 0-.405-.082-.553-.229l-5.693-5.693c-.147-.147-.229-.345-.229-.553 0-.208.082-.405.229-.553l1.571-1.571c1.201-1.201 1.201-3.15 0-4.351l-2.224-2.224c-1.201-1.201-3.15-1.201-4.351 0L5.747 6.28c-2.884 2.884-2.884 7.567 0 10.451l9.522 9.522c2.884 2.884 7.567 2.884 10.451 0l1.588-1.588c1.201-1.201 1.201-3.15 0-4.351z"/>
  </svg>
);

const LocationIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 0C9.382 0 4 5.382 4 12c0 7.874 11.039 19.415 11.516 19.93.289.314.701.494 1.13.494.429 0 .841-.18 1.13-.494C18.961 31.415 30 19.874 30 12c0-6.618-5.382-12-12-12zm0 18c-3.309 0-6-2.691-6-6s2.691-6 6-6 6 2.691 6 6-2.691 6-6 6z"/>
  </svg>
);

const EmailIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 4H4C1.791 4 0 5.791 0 8v16c0 2.209 1.791 4 4 4h24c2.209 0 4-1.791 4-4V8c0-2.209-1.791-4-4-4zm0 3.207L16 17.086 4 7.207V6h24v1.207z"/>
  </svg>
);

const GoogleMap: React.FC = () => {
  return (
    <div className="w-full h-[400px] relative rounded-lg overflow-hidden shadow-lg">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.926277749636!2d79.86661147454552!3d6.901750093108616!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2596aaa2d7297%3A0x374238af7a23c6c4!2sCrown%20Up!5e0!3m2!1sen!2slk!4v1690254871234!5m2!1sen!2slk"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="absolute inset-0"
      />
    </div>
  );
};

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

  const socialIcons: Record<string, JSX.Element> = {
    Facebook: <FacebookIcon />,
    Instagram: <InstagramIcon />,
    TikTok: <TikTokIcon />,
    WhatsApp: <WhatsAppIcon />,
    YouTube: <YouTubeIcon />
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row gap-16">
        <div className="w-full md:w-1/2">
          <h1 className="text-3xl font-bold text-black uppercase mb-8">Contact Us</h1>
          <div className="text-black space-y-8">
            <div className="space-y-2">
              <h2 className="text-2xl font-bold uppercase">CROWN UP</h2>
              <p className="text-sm leading-relaxed text-gray-600">
                Crown up is one of Sri Lanka's finest fashion clothing stores, offering you the latest fashion trends and styles.
                For any inquiries, please send us a message and we will reply to you as soon as possible.
              </p>
            </div>

            <div className="grid gap-6">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <ClockIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase">BUSINESS HOURS</span>
                  <span className="text-sm text-gray-600">Monday - Saturday: 09:00 AM - 08:00 PM</span>
                  <span className="text-sm text-gray-600">Sunday: 10:00 AM - 06:00 PM</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <PhoneIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase">PHONE</span>
                  <a href="tel:+94112689689" className="text-sm text-gray-600 hover:text-black">+94 112 689 689</a>
                  <a href="tel:+94777366955" className="text-sm text-gray-600 hover:text-black">+94 777 366 955</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <LocationIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase">ADDRESS</span>
                  <span className="text-sm text-gray-600">397A, Galle Road,</span>
                  <span className="text-sm text-gray-600">Colombo 03, Sri Lanka</span>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <EmailIcon />
                </div>
                <div className="flex flex-col">
                  <span className="text-base font-bold uppercase">EMAIL</span>
                  <a href="mailto:info@crownup.lk" className="text-sm text-gray-600 hover:text-black">info@crownup.lk</a>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3 pt-4">
              <span className="text-base font-bold uppercase">FOLLOW US</span>
              <div className="flex space-x-4">
                {['Facebook', 'Instagram', 'TikTok', 'WhatsApp', 'YouTube'].map((platform) => (
                  <a 
                    key={platform}
                    href={
                      platform === 'WhatsApp' 
                        ? 'https://wa.me/94777366955'
                        : `https://www.${platform.toLowerCase()}.com/${platform === 'YouTube' ? '@' : ''}crownup.lk`
                    }
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="flex items-center justify-center w-10 h-10 bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors rounded-lg"
                  >
                    {socialIcons[platform]}
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <GoogleMap />
            </div>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          <form onSubmit={handleSubmit} className="space-y-6 bg-gray-50 p-8 rounded-lg">
            <div className="space-y-6">
              <div>
                <input
                  type="text"
                  name="name"
                  placeholder="Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>
              
              <div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email *"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>

              <div>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone *"
                  value={formData.phone}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors"
                  required
                />
              </div>

              <div>
                <textarea
                  name="message"
                  placeholder="Message *"
                  value={formData.message}
                  onChange={handleChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-white border border-gray-200 text-sm placeholder-gray-500 focus:outline-none focus:border-gray-400 transition-colors resize-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-3 px-6 text-sm uppercase font-bold hover:bg-gray-900 transition-colors tracking-wider"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}