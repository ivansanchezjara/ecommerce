"use client";

import { ArrowLeft } from "lucide-react";

export default function StepHeader({ titulo, subtitulo, onBack, icon: Icon }) {
  return (
    <div className="mb-2">
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 mb-4 transition-colors"
      >
        <ArrowLeft size={16} />
        Volver
      </button>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-sky-50 rounded-xl flex items-center justify-center shrink-0">
          <Icon size={20} className="text-dental-blue" />
        </div>
        <div>
          <h2 className="text-lg font-black text-gray-900 leading-tight">{titulo}</h2>
          <p className="text-xs text-gray-500 mt-0.5">{subtitulo}</p>
        </div>
      </div>
    </div>
  );
}
