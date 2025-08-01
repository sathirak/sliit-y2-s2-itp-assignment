import React from 'react';

export const AddToCartButton: React.FC = () => {
  return (
    <button
      className="w-full bg-gray-800 text-white font-bold py-3 px-4 rounded-full shadow-md hover:bg-gray-700 transition duration-300 ease-in-out"
    >
      Add to Cart
    </button>
  );
};


export const BuyNowButton: React.FC = () => {
  return (
    <button
      className="w-full bg-indigo-900 text-white font-bold py-3 px-4 rounded-full shadow-md hover:bg-indigo-800 transition duration-300 ease-in-out"
    >
      Buy Now
    </button>
  );
};

export const ReviewButton: React.FC = () => {
  return (
    <button
      className="bg-black text-white font-bold py-2 px-4 rounded-md hover:bg-gray-800 transition duration-300 ease-in-out"
    >
      Write a Review
    </button>
  );
};