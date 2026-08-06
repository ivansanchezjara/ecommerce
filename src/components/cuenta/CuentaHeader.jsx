"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Heading, Text } from "@/components/ui";
import { cn } from "@/lib/utils";

/**
 * Header unificado para las páginas de Mi Cuenta en el e-commerce.
 *
 * @param {string}        title       - Título de la página (se usa si no hay breadcrumbs)
 * @param {Object[]}      breadcrumbs - Array de { label, href? }. El último es el activo.
 * @param {string}        [description] - Texto helper debajo del título
 * @param {React.ReactNode} [children] - Contenido derecho (botones, acciones)
 * @param {string}        [className] - Clases extra para el contenedor
 */
export default function CuentaHeader({
  title,
  breadcrumbs = [],
  description,
  children,
  className,
}) {
  const hasBreadcrumbs = breadcrumbs.length > 0;

  return (
    <header className={cn("bg-white border-b border-gray-100", className)}>
      <div className="max-w-4xl mx-auto px-4 py-5 flex items-center justify-between gap-4">
        {/* Left: Breadcrumbs / Title */}
        <div className="min-w-0">
          {/* Breadcrumbs */}
          {hasBreadcrumbs && (
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 flex-wrap">
              {breadcrumbs.map((crumb, i) => {
                const isLast = i === breadcrumbs.length - 1;
                return (
                  <span key={i} className="flex items-center gap-2">
                    {i > 0 && (
                      <ChevronRight size={18} className="text-slate-300" />
                    )}
                    {isLast || !crumb.href ? (
                      <span
                        className={cn(
                          "text-2xl font-bold",
                          isLast ? "text-slate-800" : "text-slate-400"
                        )}
                      >
                        {crumb.label}
                      </span>
                    ) : (
                      <Link
                        href={crumb.href}
                        className="text-2xl font-bold text-slate-400 hover:text-dental-blue transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </span>
                );
              })}
            </nav>
          )}

          {/* Título (si no hay breadcrumbs, o como heading principal) */}
          {title && (
            <Heading
              level={2}
              className={cn(
                "text-2xl",
                hasBreadcrumbs && "mt-1"
              )}
            >
              {title}
            </Heading>
          )}

          {/* Descripción */}
          {description && (
            <Text variant="bodySm" className="mt-1 text-slate-500">
              {description}
            </Text>
          )}
        </div>

        {/* Right: Actions */}
        {children && (
          <div className="flex items-center gap-3 shrink-0">
            {children}
          </div>
        )}
      </div>
    </header>
  );
}
