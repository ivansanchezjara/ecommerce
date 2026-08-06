"use client";

import CuentaHeader from "./CuentaHeader";

/**
 * Wrapper para subpáginas de mi-cuenta.
 * Muestra breadcrumb: Mi Cuenta > {title}
 * No repite el título debajo — el breadcrumb ya lo comunica.
 */
export default function CuentaPageWrapper({ title, description, actions, children }) {
  return (
    <div className="min-h-[80vh] bg-slate-50/50">
      <CuentaHeader
        description={description}
        breadcrumbs={[
          { label: "Mi Cuenta", href: "/mi-cuenta" },
          { label: title },
        ]}
      >
        {actions}
      </CuentaHeader>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {children}
      </div>
    </div>
  );
}
