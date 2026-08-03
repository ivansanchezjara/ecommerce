"use client";

import { MessageCircle, Mail, Phone } from "lucide-react";
import Link from "next/link";
import { useTienda } from "@/app/context/TiendaContext";

export default function Footer() {
  const { config } = useTienda();

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Tienda Online";
  const whatsapp = config?.whatsapp;
  const telefono = config?.telefono;
  const email = config?.email;
  const instagram = config?.instagram;
  const facebook = config?.facebook;

  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/" className="inline-block">
            <span className="text-xl font-bold">{nombreEmpresa}</span>
          </Link>
          <p className="text-sm text-gray-400">
            {config?.slogan || "Productos profesionales de calidad."}
          </p>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h4 className="font-semibold mb-3">Navegación</h4>
          <ul className="space-y-2 text-sm">
            <li>
              <Link href="/" className="text-gray-300 hover:text-white transition-colors">
                Inicio
              </Link>
            </li>
            <li>
              <Link href="/products" className="text-gray-300 hover:text-white transition-colors">
                Productos
              </Link>
            </li>
            <li>
              <Link href="/about" className="text-gray-300 hover:text-white transition-colors">
                Sobre Nosotros
              </Link>
            </li>
            <li>
              <Link href="/login" className="text-gray-300 hover:text-white transition-colors">
                Mi Cuenta
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <h4 className="font-semibold mb-3">Contacto</h4>
          <ul className="space-y-3 text-sm">
            {whatsapp && (
              <li>
                <a
                  href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hola%2C%20tengo%20una%20consulta.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
                >
                  <MessageCircle size={16} />
                  <span>WhatsApp</span>
                </a>
              </li>
            )}
            {telefono && (
              <li>
                <a
                  href={`tel:${telefono}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Phone size={16} />
                  <span>{telefono}</span>
                </a>
              </li>
            )}
            {email && (
              <li>
                <a
                  href={`mailto:${email}`}
                  className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors"
                >
                  <Mail size={16} />
                  <span>{email}</span>
                </a>
              </li>
            )}
            {instagram && (
              <li>
                <a
                  href={`https://instagram.com/${instagram}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  @{instagram}
                </a>
              </li>
            )}
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} {nombreEmpresa} · Todos los derechos reservados
      </div>
    </footer>
  );
}
