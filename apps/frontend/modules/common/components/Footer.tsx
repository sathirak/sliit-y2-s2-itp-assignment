import { Facebook, Instagram, Mail, Globe } from "lucide-react";

export const Footer = () => {
  return (
    <footer className="bg-gray-50 py-10 px-10 border-t mt-10">
      <div className="flex flex-col md:flex-row justify-between gap-10">
        {/* Newsletter */}
        <div className="flex-1">
          <div className="font-bold text-lg tracking-widest mb-4">BE THE FIRST TO KNOW</div>
          <form className="flex gap-4 mb-2">
            <input
              type="email"
              placeholder="Enter your email address..."
              className="border rounded px-4 py-2 w-64"
            />
            <button type="submit" className="bg-gray-700 text-white px-6 py-2 rounded font-bold">Sign Up</button>
          </form>
          <div className="text-gray-600 text-sm mt-2">Description</div>
        </div>

        {/* Customer Service */}
        <div className="flex-1">
          <div className="font-bold text-lg tracking-widest mb-4">CUSTOMER SERVICE</div>
          <ul className="space-y-2 text-gray-700">
            <li>Contact Us</li>
            <li>Delivery</li>
            <li>Returns and Exchanges</li>
            <li>Size Guide</li>
            <li>Privacy Policy</li>
            <li>International Shipping and Returns Policy</li>
            <li>Fashionable Feedback</li>
          </ul>
        </div>

        {/* Discover */}
        <div className="flex-1">
          <div className="font-bold text-lg tracking-widest mb-4">DISCOVER</div>
          <ul className="space-y-2 text-gray-700">
            <li>The Company</li>
          </ul>
        </div>

        {/* Social */}
        <div className="flex-1">
          <div className="font-bold text-lg tracking-widest mb-4">FOLLOW US ON</div>
          <div className="flex gap-4 mt-2">
            <span className="bg-gray-700 text-white rounded-full p-2"><Facebook size={20} /></span>
            <span className="bg-gray-700 text-white rounded-full p-2"><Globe size={20} /></span>
            <span className="bg-gray-700 text-white rounded-full p-2"><Instagram size={20} /></span>
            <span className="bg-gray-700 text-white rounded-full p-2"><Mail size={20} /></span>
          </div>
        </div>
      </div>
    </footer>
  );
}
