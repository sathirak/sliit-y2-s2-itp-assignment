
export default function Header() {
  return (
    <header className="bg-white shadow-md py-4 px-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="text-2xl font-bold tracking-tight text-gray-900">Crown Up</span>
        <span className="ml-2 text-xs bg-amber-200 text-amber-800 rounded px-2 py-0.5 font-semibold">Fashion</span>
      </div>
      <nav className="flex gap-4">
        <a href="#" className="text-gray-700 hover:text-amber-700 transition-colors">Home</a>
        <a href="#" className="text-gray-700 hover:text-amber-700 transition-colors">Shop</a>
        <a href="#" className="text-gray-700 hover:text-amber-700 transition-colors">Contact</a>
      </nav>
    </header>
  );
}
