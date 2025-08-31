import React from "react";
import Image1 from "@/modules/assets/images/image1.jpeg";
import Image2 from "@/modules/assets/images/image2.webp";
import Image3 from "@/modules/assets/images/image3.webp";
import Image4 from "@/modules/assets/images/image4.webp";
import Image from "next/image";

const products = [
  {
    id: "290825",
    title: "Elasticated Top",
    price: 6200,
    installment: 2066.66,
    image: Image1,
    watermark: "CROWNUP",
  },
  {
    id: "250825-1",
    title: "Puff Sleeve Dress",
    price: 9800,
    installment: 3266.66,
    image: Image2,
    watermark: "CROWNUP",
  },
  {
    id: "250825-2",
    title: "Collared Neck Button Down Dress",
    price: 9800,
    installment: 3266.66,
    image: Image3,
    watermark: "CROWNUP",
  },
  {
    id: "250825-3",
    title: "Linen Short",
    price: 5200,
    installment: 1733.33,
    image: Image4,
    watermark: "CROWNUP",
  },
];

export const NewArrivals = () => {
  return (
    <section className="max-w-6xl mx-auto py-10">
      <h2 className="text-3xl font-semibold text-center mb-2 tracking-wide">
        NEW ARRIVALS
      </h2>
      <div className="flex justify-center mb-8">
        <span className="block w-16 h-1 bg-black"></span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white shadow rounded overflow-hidden flex flex-col items-center"
          >
            <div className="w-full h-96 flex items-center justify-center bg-gray-100">
              <Image
                src={p.image}
                alt={p.title}
                className="object-cover h-full w-full"
              />
            </div>
            <div className="p-4 w-full text-center">
              <div className="text-lg font-medium mb-1">
                {p.title} - {p.id}
              </div>
              <div className="text-2xl font-bold mb-1">
                {p.price.toLocaleString()}.00
              </div>
              <div className="text-sm mb-2">
                or 3 x{" "}
                <span className="font-semibold">
                  {p.installment.toLocaleString()}
                </span>{" "}
                with{" "}
                <span className="font-bold">intpay</span>
              </div>
              <div className="text-xs text-gray-400 mt-2">{p.watermark}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};