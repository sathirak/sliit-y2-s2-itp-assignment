
import { AddToCartButton, BuyNowButton, ReviewButton } from "../../common/components/Buttons";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-[60vh] text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Welcome to Crown Up</h1>
      <p className="text-lg text-gray-600 mb-6 max-w-xl">Elevate your style with our exclusive fashion collection. Simple. Elegant. You.</p>
      <div className="w-64 space-y-4">
        <AddToCartButton />
        <BuyNowButton />
        <ReviewButton />
      </div>
    </main>
  );
}
