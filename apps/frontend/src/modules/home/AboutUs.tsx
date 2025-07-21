import React from "react";

const AboutUs = () => {
  return (
    <div className="font-sans">

      {/* About the Brand */}
      <section className="w-screen h-screen bg-gray-100 flex items-center justify-center">
        <div className="max-w-6xl w-full px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="flex gap-6">
            <img
              src="/images/pink-dress.jpg"
              alt="Model in Pink Dress"
              className="w-48 md:w-60 h-auto object-cover rounded-md shadow-md"
            />
            <img
              src="/images/black-suit.jpg"
              alt="Model in Black Suit"
              className="w-48 md:w-60 h-auto object-cover rounded-md shadow-md"
            />
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-semibold text-gray-800 mb-4 leading-snug">
              About <br />
              <span className="text-brown-800">the Brand</span>
            </h2>
            <p className="text-gray-700 text-base leading-relaxed max-w-md">
              Crown Up Fashion was started in 1984 to create stylish and
              comfortable clothing for everyone. We believe fashion 
              should be easy to wear and make you feel confident. 
              From casual outfits to special pieces, our goal is to help
            you look and feel your best every day.
            </p>
          </div>
        </div>
      </section>

      
      <section className="bg-gray-100 py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-10">What Our Customers Say</h2>
        <div className="max-w-4xl mx-auto space-y-8">
          <blockquote className="text-gray-700 italic">
            “Crown Up changed my look completely. Absolutely love them!”
            <footer className="text-gray-500 mt-2">— Priya S.</footer>
          </blockquote>
          <blockquote className="text-gray-700 italic">
            “My go-to clothing brand for years now. Stylish, comfortable, and great quality.”
            <footer className="text-gray-500 mt-2">— Anjali D.</footer>
          </blockquote>
        </div>
      </section>

      
      <section className="bg-white py-20 px-6 text-center">
        <h2 className="text-3xl font-semibold text-gray-800 mb-6">Stay Connected</h2>
        <p className="text-gray-600 mb-6">Sign up to receive updates and offers</p>
        <form className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
          <input
            type="email"
            placeholder="Your email"
            className="px-4 py-2 rounded-md border border-gray-300 w-full"
          />
          <button className="bg-brown-800 text-black px-6 py-2 rounded-md hover:bg-brown-700 transition">
            Subscribe
          </button>
        </form>
      </section>

      
    </div>
  );
};

export default AboutUs;

