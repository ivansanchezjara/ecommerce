"use client";

import Link from "next/link";
import { ArrowRight, Percent } from "lucide-react";
import { Badge, Button, Heading, Text } from "@/components/ui";

/**
 * Sección CTA reutilizable para invitar a usuarios a registrarse/ingresar.
 *
 * @param {string} [badgeText="Beneficios Exclusivos"] - Texto del badge
 * @param {ReactNode} [badgeIcon] - Ícono del badge (componente Lucide)
 * @param {string} [titulo="¿Sos odontólogo o tenés una clínica dental?"] - Título principal
 * @param {string} [descripcion] - Texto descriptivo
 * @param {string} [ctaHref="/login"] - URL del botón principal
 * @param {string} [ctaText="Iniciar Sesión / Registrarse"] - Texto del botón principal
 * @param {string} [secondaryHref="/about"] - URL del botón secundario
 * @param {string} [secondaryText="Saber más sobre Dent-Par"] - Texto del botón secundario
 * @param {string} [className] - Clases adicionales para el section wrapper
 */
export default function CtaProfesionales({
  badgeText = "Beneficios Exclusivos",
  badgeIcon: BadgeIcon = Percent,
  titulo = "¿Sos odontólogo o tenés una clínica dental?",
  descripcion = "Registrate e ingresá con tu cuenta para acceder a nuestra lista de precios preferenciales, promociones especiales por cantidad y cotizaciones en el día.",
  ctaHref = "/login",
  ctaText = "Iniciar Sesión / Registrarse",
  secondaryHref = "/about",
  secondaryText = "Saber más sobre Dent-Par",
  className = "",
}) {
  return (
    <section className={`py-16 bg-gradient-to-r from-slate-900 via-slate-800 to-blue-950 text-white relative overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_left,rgba(2,132,199,0.15),transparent)] pointer-events-none" />
      <div className="max-w-5xl mx-auto px-4 text-center relative z-10 space-y-6">
        <Badge variant="info" className="bg-blue-500/10 text-sky-400 border border-sky-400/20">
          <BadgeIcon size={12} className="mr-1" /> {badgeText}
        </Badge>
        <Heading level={2} className="text-3xl md:text-4xl text-white">
          {titulo}
        </Heading>
        <Text variant="body" className="text-slate-300 max-w-2xl mx-auto font-light leading-relaxed">
          {descripcion}
        </Text>
        <div className="pt-4 flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button
            as={Link}
            href={ctaHref}
            variant="secondary"
            size="lg"
            className="rounded-full bg-white text-slate-900 hover:bg-slate-100 border-none shadow-lg"
          >
            {ctaText}
          </Button>
          {secondaryHref && (
            <Button
              as={Link}
              href={secondaryHref}
              variant="ghost"
              size="lg"
              icon={ArrowRight}
              iconPosition="right"
              className="text-slate-300 hover:text-white hover:bg-transparent border-none"
            >
              {secondaryText}
            </Button>
          )}
        </div>
      </div>
    </section>
  );
}
