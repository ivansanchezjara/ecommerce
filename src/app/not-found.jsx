import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
      <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Página no encontrada</h2>
      <p className="text-gray-500 mb-8">La página que buscas no existe o fue movida.</p>
      <Link
        href="/"
        className="px-6 py-3 bg-gray-900 text-white rounded-full font-bold hover:bg-gray-800 transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
