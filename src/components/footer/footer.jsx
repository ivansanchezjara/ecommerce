"use client";

import { MessageCircle, Mail, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { useTienda } from "@/app/context/TiendaContext";
import { Text, Heading } from "@/components/ui";

export default function Footer() {
  const { config } = useTienda();

  const nombreEmpresa = config?.nombre_fantasia || config?.nombre || "Dent-Par";
  const whatsapp = config?.whatsapp;
  const telefono = config?.telefono;
  const email = config?.email;
  const instagram = config?.instagram;
  const sucursales = config?.sucursales || [];

  return (
    <footer className="w-full border-t bg-gray-900 text-white">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 md:grid-cols-3 gap-10 text-center md:text-left">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Link href="/" className="inline-block">
            <Heading level={5} className="text-white">
              {nombreEmpresa}
            </Heading>
          </Link>
          <Text variant="bodySm" className="text-gray-400">
            {config?.slogan || "Productos profesionales de calidad."}
          </Text>
        </div>

        {/* Navigation */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Heading level={6} className="text-gray-400 mb-1">Navegación</Heading>
          <ul className="space-y-2">
            {[
              { href: "/", label: "Inicio" },
              { href: "/products", label: "Productos" },
              { href: "/about", label: "Sobre Nosotros" },
              { href: "/login", label: "Mi Cuenta" },
            ].map(({ href, label }) => (
              <li key={href}>
                <Link href={href}>
                  <Text variant="bodySm" className="text-gray-300 hover:text-white transition-colors">
                    {label}
                  </Text>
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <Heading level={6} className="text-gray-400 mb-1">Contacto</Heading>

          {email && (
            <a href={`mailto:${email}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <Mail size={16} />
              <Text variant="bodySm" as="span" className="text-inherit">{email}</Text>
            </a>
          )}

          {whatsapp && (
            <a
              href={`https://wa.me/${whatsapp.replace(/[^0-9]/g, "")}?text=Hola%2C%20tengo%20una%20consulta.`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-300 hover:text-green-400 transition-colors"
            >
              <MessageCircle size={16} />
              <Text variant="bodySm" as="span" className="text-inherit">WhatsApp</Text>
            </a>
          )}

          {sucursales.length > 0 && (
            <div className="mt-4 space-y-4 w-full">
              {sucursales.map((suc) => (
                <div key={suc.id} className="space-y-1.5">
                  <Text variant="bodySmBold" className="text-white">{suc.nombre}</Text>
                  {suc.telefono && (
                    <a href={`tel:${suc.telefono}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
                      <Phone size={14} />
                      <Text variant="bodySm" as="span" className="text-inherit">{suc.telefono}</Text>
                    </a>
                  )}
                  {suc.direccion && (
                    <div className="flex items-start gap-2 text-gray-400">
                      <MapPin size={14} className="mt-0.5 shrink-0" />
                      <Text variant="bodySm" as="span" className="text-inherit">{suc.direccion}</Text>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {sucursales.length === 0 && telefono && (
            <a href={`tel:${telefono}`} className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors">
              <Phone size={16} />
              <Text variant="bodySm" as="span" className="text-inherit">{telefono}</Text>
            </a>
          )}

          {instagram && (
            <a
              href={`https://instagram.com/${instagram}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-300 hover:text-white transition-colors"
            >
              <Text variant="bodySm" as="span" className="text-inherit">@{instagram}</Text>
            </a>
          )}
        </div>
      </div>

      <div className="border-t border-white/10 py-6 text-center">
        <Text variant="bodySm" className="text-gray-500">
          © {new Date().getFullYear()} {nombreEmpresa} · Todos los derechos reservados
        </Text>
      </div>
    </footer>
  );
}
