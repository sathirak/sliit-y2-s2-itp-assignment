import React from "react";

export default function UserLayout({ children, title }: { children: React.ReactNode, title: string }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="px-10 py-6 border-b mb-6">
        <h1 className="text-3xl font-bold tracking-widest">{title}</h1>
      </div>
      <main className="px-10 pb-10">
        {children}
      </main>
    </div>
  );
}
