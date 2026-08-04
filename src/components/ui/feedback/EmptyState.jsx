"use client";
import Button from "../basics/Button";
import { Heading, Text } from "../basics/Typography";

/**
 * Estado vacío estandarizado.
 * Para "sin resultados", carrito vacío, etc.
 *
 * @param {string} titulo - Título principal
 * @param {string} descripcion - Mensaje explicativo
 * @param {() => void} onAction - Callback opcional para botón de acción
 * @param {string} textoBoton - Etiqueta del botón
 * @param {string|React.ReactNode} icon - Emoji o ícono visual
 * @param {boolean} inline - Si es true, sin card wrapper
 */
export default function EmptyState({
  titulo = "No se encontraron resultados",
  descripcion = "Parece que no hay información para mostrar en este momento.",
  onAction = null,
  textoBoton = "Explorar",
  icon = "🔍",
  inline = false,
}) {
  return (
    <div
      className={
        inline
          ? "py-10 text-center flex flex-col items-center justify-center animate-in fade-in duration-200 w-full"
          : "bg-white rounded-2xl shadow-sm border border-slate-200 p-16 text-center flex flex-col items-center justify-center animate-in fade-in zoom-in-95 duration-300 w-full"
      }
    >
      <span className="text-6xl mb-4 select-none">{icon}</span>

      <Heading level={4} className="text-slate-900 mb-2">
        {titulo}
      </Heading>

      <Text variant="bodySm" className="text-slate-500 max-w-sm mx-auto leading-relaxed">
        {descripcion}
      </Text>

      {onAction && (
        <Button
          variant="secondary"
          onClick={onAction}
          className="mt-6"
        >
          {textoBoton}
        </Button>
      )}
    </div>
  );
}
