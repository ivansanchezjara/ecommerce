import { Text } from "../basics/Typography";

/**
 * Contenedor de sección con cabecera, subtítulo opcional y acción.
 *
 * @param {string} title - Título de la sección
 * @param {string} subtitle - Subtítulo opcional
 * @param {React.ReactNode} action - Botón/acción en el header
 * @param {React.ReactNode} children - Contenido
 */
export default function Section({ title, subtitle, action, children }) {
  return (
    <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between gap-4 select-none">
        <div>
          <Text as="h2" variant="label" className="text-slate-500 font-black">
            {title}
          </Text>
          {subtitle && (
            <Text variant="bodySm" className="mt-0.5 text-[11px] text-slate-400">
              {subtitle}
            </Text>
          )}
        </div>
        {action && <div className="flex items-center shrink-0">{action}</div>}
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}
