"use client";
import { useState, useEffect, useCallback, useRef } from "react";
import dynamic from "next/dynamic";
import { MapPin } from "lucide-react";
import { DEPARTAMENTOS, CIUDADES_POR_DEPARTAMENTO } from "@/config/paraguay";

const MapaPicker = dynamic(() => import("./MapaPicker"), { ssr: false });

const selectClass =
  "w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors";

// ─── Helpers ────────────────────────────────────────────────────

function norm(s) {
  return (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
}

function matchDepartamento(raw) {
  if (!raw) return null;
  const n = norm(raw);
  return (
    DEPARTAMENTOS.find((d) => norm(d) === n) ||
    DEPARTAMENTOS.find((d) => n.includes(norm(d)) || norm(d).includes(n))
  );
}

function matchCiudad(ciudadRaw, departamento) {
  if (!ciudadRaw || !departamento) return "";
  const ciudades = CIUDADES_POR_DEPARTAMENTO[departamento] || [];
  const n = norm(ciudadRaw);
  return (
    ciudades.find((c) => norm(c) === n) ||
    ciudades.find((c) => n.includes(norm(c)) || norm(c).includes(n)) ||
    ""
  );
}

// ─── Nominatim search for address autocomplete ──────────────────

async function searchStreet(query, context) {
  if (!query || query.trim().length < 3) return [];
  const fullQuery = context ? `${query}, ${context}, Paraguay` : `${query}, Paraguay`;
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(fullQuery)}&format=json&addressdetails=1&limit=5&countrycodes=py&accept-language=es`,
      { headers: { "User-Agent": "ERP-App/1.0" } }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch { return []; }
}

// ─── AddressInput con autocomplete ──────────────────────────────

function AddressInput({ value, onChange, onSelect, context, disabled, placeholder }) {
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searching, setSearching] = useState(false);
  const timerRef = useRef(null);

  const handleChange = useCallback((e) => {
    if (onChange) onChange(e.target.value);
    const val = e.target.value;
    if (timerRef.current) clearTimeout(timerRef.current);
    if (val.trim().length < 3) { setSuggestions([]); setShowSuggestions(false); return; }
    timerRef.current = setTimeout(async () => {
      setSearching(true);
      const results = await searchStreet(val, context);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
      setSearching(false);
    }, 500);
  }, [onChange, context]);

  const handleSelect = (item) => {
    const addr = item.address || {};
    const calle = [addr.road, addr.house_number].filter(Boolean).join(" ");
    const barrio = addr.suburb || addr.neighbourhood || "";
    const direccion = [calle, barrio].filter(Boolean).join(", ");

    let departamentoRaw = (addr.state || "")
      .replace(/^Departamento\s+(de\s+)?/i, "")
      .replace(/^Distrito\s+/i, "")
      .replace(/^Dept\.\s*/i, "")
      .trim();
    const ciudad = addr.city || addr.town || addr.village || addr.municipality || "";
    if (!departamentoRaw && ciudad.toLowerCase().includes("asunci")) departamentoRaw = "Asunción";

    if (onChange) onChange(direccion || item.display_name?.split(",")[0] || "");
    setShowSuggestions(false);
    setSuggestions([]);

    if (onSelect) {
      onSelect({
        lat: parseFloat(item.lat),
        lng: parseFloat(item.lon),
        direccion: direccion || item.display_name?.split(",")[0] || "",
        departamentoRaw,
        ciudad,
      });
    }
  };

  return (
    <div className="relative">
      <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={16} /></div>
      <input
        type="text"
        value={value}
        onChange={handleChange}
        onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
        onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
        disabled={disabled}
        placeholder={placeholder}
        className={`${selectClass} pl-10`}
      />
      {searching && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-400">...</span>}
      {showSuggestions && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-44 overflow-y-auto">
          {suggestions.map((item, i) => (
            <button
              key={i}
              type="button"
              className="w-full text-left px-3 py-2.5 text-xs hover:bg-slate-50 transition-colors border-b border-slate-50 last:border-0"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => handleSelect(item)}
            >
              <span className="text-slate-700 line-clamp-2">{item.display_name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── UbicacionPicker ────────────────────────────────────────────

/**
 * UbicacionPicker para el ecommerce.
 * Departamento → Ciudad (select vinculado) → Dirección (autocomplete) → MapaPicker.
 *
 * Props:
 * - departamento, ciudad, direccion, latitud, longitud
 * - onChange: ({ departamento, ciudad, direccion, latitud, longitud }) => void
 * - mapHeight: string (default "350px")
 * - disabled: boolean
 * - label: string
 */
export default function UbicacionPicker({
  departamento = "",
  ciudad = "",
  direccion = "",
  latitud = null,
  longitud = null,
  onChange,
  mapHeight = "350px",
  disabled = false,
  label,
}) {
  const [ciudades, setCiudades] = useState([]);

  useEffect(() => {
    setCiudades(departamento ? CIUDADES_POR_DEPARTAMENTO[departamento] || [] : []);
  }, [departamento]);

  // Ref para evitar stale closures
  const stateRef = useRef({ departamento, ciudad, direccion, latitud, longitud, onChange });
  stateRef.current = { departamento, ciudad, direccion, latitud, longitud, onChange };

  const emit = useCallback((patch) => {
    const { onChange: cb, ...current } = stateRef.current;
    if (cb) cb({ ...current, ...patch });
  }, []);

  const handleDepartamentoChange = (e) => {
    emit({ departamento: e.target.value, ciudad: "" });
  };

  const handleCiudadChange = (e) => {
    emit({ ciudad: e.target.value });
  };

  const handleDireccionChange = (value) => {
    emit({ direccion: value });
  };

  const handleAddressSelect = ({ lat, lng, departamentoRaw, ciudad: ciudadRaw, direccion: dir }) => {
    const patch = { latitud: lat, longitud: lng };
    if (dir) patch.direccion = dir;
    if (departamentoRaw) {
      const deptoMatch = matchDepartamento(departamentoRaw);
      if (deptoMatch) {
        patch.departamento = deptoMatch;
        patch.ciudad = matchCiudad(ciudadRaw, deptoMatch);
      }
    }
    emit(patch);
  };

  const handleMapChange = useCallback(({ lat, lng, departamentoRaw, ciudad: ciudadRaw, direccion: dirRaw }) => {
    const patch = { latitud: lat, longitud: lng };
    if (departamentoRaw) {
      const deptoMatch = matchDepartamento(departamentoRaw);
      if (deptoMatch) {
        patch.departamento = deptoMatch;
        patch.ciudad = matchCiudad(ciudadRaw, deptoMatch);
      }
    }
    if (dirRaw != null) patch.direccion = dirRaw;
    emit(patch);
  }, [emit]);

  const context = [ciudad, departamento].filter(Boolean).join(", ");

  return (
    <div className="space-y-4">
      {label && (
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
          {label}
        </label>
      )}

      {/* Departamento + Ciudad */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Departamento</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={16} /></div>
            <select
              className={`${selectClass} pl-10`}
              value={departamento}
              onChange={handleDepartamentoChange}
              disabled={disabled}
            >
              <option value="">Seleccionar</option>
              {DEPARTAMENTOS.map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ciudad</label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><MapPin size={16} /></div>
            <select
              className={`${selectClass} pl-10`}
              value={ciudad}
              onChange={handleCiudadChange}
              disabled={disabled || !departamento}
            >
              <option value="">Seleccionar</option>
              {ciudades.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Dirección con autocomplete */}
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Dirección</label>
        <AddressInput
          value={direccion}
          onChange={handleDireccionChange}
          onSelect={handleAddressSelect}
          context={context}
          disabled={disabled}
          placeholder="Calle, número, barrio..."
        />
      </div>

      {/* Mapa */}
      <MapaPicker
        latitud={latitud}
        longitud={longitud}
        centerOn={context}
        onChange={handleMapChange}
        height={mapHeight}
        disabled={disabled}
        hideSearch
      />
    </div>
  );
}
