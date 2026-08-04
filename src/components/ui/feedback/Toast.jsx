"use client";
import { useEffect, useState, useCallback } from "react";
import { X } from "lucide-react";
import Button from "../basics/Button";
import { Text } from "../basics/Typography";

/**
 * Notificación Toast con auto-dismiss y barra de progreso.
 *
 * @param {string} message - Texto de la notificación
 * @param {"info"|"error"|"warning"|"success"} type - Tipo visual
 * @param {() => void} onClose - Callback al cerrar
 */
export default function Toast({ message, type = "info", onClose }) {
  const [isClosing, setIsClosing] = useState(false);

  const handleClose = useCallback(() => {
    setIsClosing(true);
    setTimeout(onClose, 300);
  }, [onClose]);

  useEffect(() => {
    const timer = setTimeout(() => {
      handleClose();
    }, 4700);
    return () => clearTimeout(timer);
  }, [handleClose]);

  const isError = type === "error" || type === "warning";
  const isSuccess = type === "success";

  const bgColor = isError
    ? "bg-red-950/90"
    : isSuccess
      ? "bg-emerald-950/90"
      : "bg-slate-900/90";
  const borderColor = isError
    ? "border-red-500/50"
    : isSuccess
      ? "border-emerald-500/50"
      : "border-white/10";
  const textColor = isError
    ? "text-red-100"
    : isSuccess
      ? "text-emerald-100"
      : "text-slate-100";
  const accentColor = isError
    ? "bg-red-500"
    : isSuccess
      ? "bg-emerald-500"
      : "bg-blue-500";

  return (
    <div
      className={`
        relative pointer-events-auto min-w-[300px] max-w-[400px]
        ${bgColor} backdrop-blur-md border ${borderColor}
        rounded-xl py-3 px-4 flex items-center justify-between gap-4
        shadow-xl transition-all duration-300 overflow-hidden
        ${isClosing ? "opacity-0 translate-x-8" : "opacity-100 translate-x-0"}
      `}
    >
      <div className="flex items-center gap-2.5 flex-1 min-w-0">
        <div className={`w-1 h-4 rounded-full shrink-0 ${accentColor}`} />
        <Text
          variant="bodyXs"
          className={`${textColor} leading-tight truncate w-full text-left font-medium`}
        >
          {message}
        </Text>
      </div>

      <Button
        variant="ghost"
        size="icon"
        onClick={handleClose}
        icon={X}
        className="text-white/40 hover:text-white hover:bg-white/10 w-6 h-6 rounded-lg p-0 shrink-0 border-none transition-all duration-200"
        title="Cerrar notificación"
      />

      {/* Barra de progreso */}
      <div className="absolute bottom-0 left-0 w-full h-[2px] opacity-30">
        <div
          className={`h-full origin-left ${accentColor}`}
          style={{ animation: "toast-progress 5s linear forwards" }}
        />
      </div>

      <style jsx>{`
        @keyframes toast-progress {
          from {
            transform: scaleX(1);
          }
          to {
            transform: scaleX(0);
          }
        }
      `}</style>
    </div>
  );
}
