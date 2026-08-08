"use client";

export default function ErrorBanner({ mensaje }) {
  return (
    <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
      {mensaje}
    </div>
  );
}
