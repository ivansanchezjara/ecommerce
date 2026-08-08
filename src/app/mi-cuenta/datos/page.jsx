"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { getPerfil, updatePerfil, enviarCodigo, verificarCodigo, vincularContacto } from "@/services/auth";
import {
  crearDireccion, buscarInstituciones, getOfertasAcademicas,
  buscarClinicas, crearFormacion,
  crearVinculoLaboral, eliminarVinculoLaboral,
  crearVinculoDocente, eliminarVinculoDocente,
} from "@/services/cuenta";
import { LoadingScreen, Button, Input, UbicacionPicker } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  User, Mail, Phone,
  Save, Loader2, Check, AlertCircle, Globe,
  FileText, Calendar, Stethoscope, Plus, SendHorizontal, Truck,
  GraduationCap, Briefcase, X, Search, Building2, Info, BookOpen,
} from "lucide-react";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";
import SeccionVerificacion from "@/components/cuenta/SeccionVerificacion";

const TRATAMIENTOS = [
  { value: "", label: "Sin tratamiento" },
  { value: "Sr.", label: "Sr." },
  { value: "Sra.", label: "Sra." },
  { value: "Dr.", label: "Dr." },
  { value: "Dra.", label: "Dra." },
  { value: "Prof.", label: "Prof." },
  { value: "Prof. Dr.", label: "Prof. Dr." },
  { value: "Prof. Dra.", label: "Prof. Dra." },
];

const CATEGORIAS = [
  { value: "", label: "Sin categoría" },
  { value: "odontologo", label: "Odontólogo/a" },
  { value: "estudiante", label: "Estudiante" },
  { value: "protesista", label: "Protesista" },
  { value: "profesor", label: "Profesor/a" },
  { value: "cliente_casual", label: "Cliente Casual" },
];

const TIPO_FORMACION_OPTIONS = [
  { value: "grado", label: "Grado" },
  { value: "posgrado", label: "Posgrado" },
  { value: "especializacion", label: "Especialización" },
  { value: "diplomado", label: "Diplomado" },
  { value: "residencia", label: "Residencia" },
  { value: "curso", label: "Curso" },
];

const TIPO_DOCENTE_OPTIONS = [
  { value: "titular", label: "Titular" },
  { value: "adjunto", label: "Adjunto" },
  { value: "asistente", label: "Asistente" },
  { value: "instructor", label: "Instructor" },
  { value: "invitado", label: "Invitado" },
];

function SelectField({ label, value, onChange, options, icon: Icon }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className="relative">
        {Icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={16} /></div>}
        <select value={value || ""} onChange={(e) => onChange(e.target.value)} className={`w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors ${Icon ? "pl-10" : ""}`}>
          {options.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
        </select>
      </div>
    </div>
  );
}

/**
 * Campo para vincular un contacto faltante (email o celular).
 * Muestra un mini-flujo OTP inline: ingresar valor → enviar código → verificar → guardado.
 */
function VincularContactoField({ tipo, onVinculado }) {
  const [paso, setPaso] = useState("idle"); // idle | input | enviando | codigo | verificando | listo
  const [valor, setValor] = useState("");
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const esEmail = tipo === "email";
  const label = esEmail ? "Email" : "Teléfono / Celular";
  const placeholder = esEmail ? "tu@email.com" : "+595 981 123456";
  const Icon = esEmail ? Mail : Phone;

  // Cooldown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  async function handleEnviarCodigo() {
    setError("");
    setPaso("enviando");
    try {
      const res = await enviarCodigo(valor.trim(), "vincular");
      setCooldown(res.cooldown_segundos || 60);
      setPaso("codigo");
    } catch (err) {
      setError(err.data?.detail || "Error al enviar el código.");
      setPaso("input");
    }
  }

  async function handleVerificar() {
    setError("");
    setPaso("verificando");
    try {
      const res = await verificarCodigo(valor.trim(), codigo.trim(), "vincular");
      await vincularContacto(valor.trim(), res.token_verificacion_id);
      setPaso("listo");
      onVinculado?.();
    } catch (err) {
      setError(err.data?.detail || "Error al verificar.");
      setPaso("codigo");
    }
  }

  if (paso === "listo") {
    return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2.5">
          <Check size={16} className="text-emerald-600" />
          <span className="text-sm font-semibold text-emerald-700">{valor}</span>
          <span className="text-xs text-emerald-500 ml-auto">Verificado</span>
        </div>
      </div>
    );
  }

  if (paso === "idle") {
    return (
      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
        <button
          type="button"
          onClick={() => setPaso("input")}
          className="w-full flex items-center gap-2.5 rounded-xl border-2 border-dashed border-slate-200 bg-slate-50/50 px-4 py-2.5 text-sm text-slate-400 hover:border-dental-blue hover:text-dental-blue hover:bg-dental-blue/5 transition-colors"
        >
          <Plus size={16} />
          <span>Agregar y verificar {esEmail ? "email" : "celular"}</span>
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>

      {(paso === "input" || paso === "enviando") && (
        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Icon size={16} /></div>
            <input
              type={esEmail ? "email" : "tel"}
              value={valor}
              onChange={(e) => setValor(e.target.value)}
              placeholder={placeholder}
              className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-10 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
            />
          </div>
          <button
            type="button"
            onClick={handleEnviarCodigo}
            disabled={!valor.trim() || paso === "enviando"}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-dental-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-dental-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {paso === "enviando" ? <Loader2 size={16} className="animate-spin" /> : <SendHorizontal size={16} />}
            Enviar código
          </button>
        </div>
      )}

      {(paso === "codigo" || paso === "verificando") && (
        <>
          <p className="text-xs text-slate-500">
            Ingresá el código de 6 dígitos enviado a <strong className="text-slate-700">{valor}</strong>
          </p>
          <div className="flex gap-2">
            <input
              type="text"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="123456"
              maxLength={6}
              className="w-32 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-center font-mono tracking-widest text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
            />
            <button
              type="button"
              onClick={handleVerificar}
              disabled={codigo.length < 6 || paso === "verificando"}
              className="shrink-0 flex items-center gap-1.5 rounded-xl bg-dental-blue px-4 py-2.5 text-sm font-semibold text-white hover:bg-dental-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {paso === "verificando" ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
              Verificar
            </button>
            {cooldown > 0 ? (
              <span className="self-center text-xs text-slate-400">Reenviar en {cooldown}s</span>
            ) : (
              <button type="button" onClick={handleEnviarCodigo} className="self-center text-xs text-dental-blue font-semibold hover:underline">
                Reenviar
              </button>
            )}
          </div>
        </>
      )}

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>
  );
}


// ─── Buscador genérico (instituciones o clínicas) ───────────────────

function EntitySearchField({ label, placeholder, fetchFn, onSelect, renderItem }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (query.length < 2) { setResults([]); return; }
    const timeout = setTimeout(async () => {
      setLoading(true);
      try {
        const data = await fetchFn(query);
        setResults(data);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 300);
    return () => clearTimeout(timeout);
  }, [query, fetchFn]);

  return (
    <div className="relative">
      <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">{label}</label>
      <div className="relative mt-1.5">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"><Search size={14} /></div>
        <input
          type="text"
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); }}
          onFocus={() => results.length > 0 && setOpen(true)}
          placeholder={placeholder}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 pl-9 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
        />
      </div>
      {open && query.length >= 2 && (
        <div className="absolute z-30 top-full left-0 right-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {loading && <div className="px-3 py-2 text-xs text-slate-400">Buscando...</div>}
          {!loading && results.length === 0 && <div className="px-3 py-2 text-xs text-slate-400">Sin resultados</div>}
          {results.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { onSelect(item); setQuery(""); setOpen(false); }}
              className="w-full text-left px-3 py-2.5 text-sm hover:bg-dental-blue/5 transition-colors border-b border-slate-50 last:border-0"
            >
              {renderItem ? renderItem(item) : item.razon_social}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Formaciones Académicas ─────────────────────────────────────────

function FormacionesSection({ formaciones, onChanged }) {
  const [adding, setAdding] = useState(false);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <GraduationCap size={18} className="text-dental-blue" />
          <Heading level={4} className="text-lg">Formación Académica</Heading>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-dental-blue hover:text-dental-blue/80 transition-colors"
          >
            <Plus size={14} /> Agregar
          </button>
        )}
      </div>

      {formaciones.length === 0 && !adding && (
        <p className="text-sm text-slate-400 italic">No tenés formaciones académicas cargadas.</p>
      )}

      {/* Lista de formaciones existentes */}
      <div className="space-y-3">
        {formaciones.map((f) => (
          <div key={f.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <GraduationCap size={16} className="text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">
                {f.titulo_obtenido || f.oferta_academica || f.tipo_display}
              </p>
              <p className="text-xs text-slate-400">
                {f.institucion}
                {f.anio_ingreso && ` • ${f.anio_ingreso}`}
                {f.anio_egreso && `–${f.anio_egreso}`}
              </p>
            </div>
            {f.vigente && (
              <span className="text-[10px] font-bold uppercase text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">Vigente</span>
            )}
          </div>
        ))}
      </div>

      {/* Nota de seguridad */}
      {formaciones.length > 0 && (
        <p className="mt-4 text-xs text-slate-400 italic">
          Los datos de formación no se pueden eliminar una vez cargados. Si necesitás corregir algún dato, contactá a un asesor de ventas.
        </p>
      )}

      {/* Formulario para agregar */}
      {adding && (
        <AddFormacionForm
          onCreated={() => { setAdding(false); onChanged(); }}
          onCancel={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function AddFormacionForm({ onCreated, onCancel }) {
  const [institucion, setInstitucion] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [form, setForm] = useState({
    oferta_academica_id: "",
    tipo: "grado",
    anio_ingreso: "",
    titulo_obtenido: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // Cargar ofertas cuando se selecciona una institución
  useEffect(() => {
    if (!institucion) { setOfertas([]); return; }
    getOfertasAcademicas(institucion.id).then(setOfertas).catch(() => setOfertas([]));
  }, [institucion]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!institucion) { setError("Seleccioná una institución."); return; }
    setSaving(true);
    setError("");
    try {
      await crearFormacion({
        institucion_id: institucion.id,
        oferta_academica_id: form.oferta_academica_id || null,
        tipo: form.tipo,
        anio_ingreso: form.anio_ingreso ? parseInt(form.anio_ingreso) : null,
        titulo_obtenido: form.titulo_obtenido,
      });
      onCreated();
    } catch (err) {
      setError(err.data?.detail || "Error al agregar formación.");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-blue-50/50 border border-blue-100 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Text className="text-sm font-bold text-dental-blue">Nueva Formación</Text>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>

      {/* Buscar institución */}
      {!institucion ? (
        <EntitySearchField
          label="Institución"
          placeholder="Buscar universidad, instituto..."
          fetchFn={buscarInstituciones}
          onSelect={setInstitucion}
          renderItem={(item) => (
            <span>{item.razon_social} {item.abreviatura && <span className="text-slate-400">({item.abreviatura})</span>}</span>
          )}
        />
      ) : (
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-blue-200">
          <Building2 size={14} className="text-dental-blue" />
          <span className="text-sm font-medium text-slate-700">{institucion.razon_social}</span>
          <button type="button" onClick={() => { setInstitucion(null); setOfertas([]); setForm(f => ({ ...f, oferta_academica_id: "" })); }} className="ml-auto text-slate-400 hover:text-red-500">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Oferta académica (si hay opciones) */}
      {institucion && ofertas.length > 0 && (
        <SelectField
          label="Carrera / Programa"
          value={form.oferta_academica_id}
          onChange={(v) => setForm((f) => ({ ...f, oferta_academica_id: v }))}
          options={[{ value: "", label: "— Sin especificar —" }, ...ofertas.map((o) => ({ value: o.id, label: o.nombre }))]}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Tipo de formación"
          value={form.tipo}
          onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}
          options={TIPO_FORMACION_OPTIONS}
        />
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Año de ingreso</label>
          <input
            type="number"
            min="1970"
            max="2030"
            value={form.anio_ingreso}
            onChange={(e) => setForm((f) => ({ ...f, anio_ingreso: e.target.value }))}
            placeholder="Ej: 2020"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Título obtenido</label>
        <input
          type="text"
          value={form.titulo_obtenido}
          onChange={(e) => setForm((f) => ({ ...f, titulo_obtenido: e.target.value }))}
          placeholder="Ej: Doctor en Odontología"
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
        />
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Cancelar</button>
        <button
          type="submit"
          disabled={!institucion || saving}
          className="flex items-center gap-1.5 rounded-xl bg-dental-blue px-5 py-2.5 text-sm font-semibold text-white hover:bg-dental-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar
        </button>
      </div>
    </form>
  );
}


// ─── Vínculos Laborales ─────────────────────────────────────────────

function VinculosSection({ vinculos, onChanged }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await eliminarVinculoLaboral(id);
      onChanged();
    } catch { /* silenciar */ }
    finally { setDeleting(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <Briefcase size={18} className="text-dental-blue" />
          <Heading level={4} className="text-lg">Lugar de Trabajo</Heading>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-dental-blue hover:text-dental-blue/80 transition-colors"
          >
            <Plus size={14} /> Agregar
          </button>
        )}
      </div>

      {vinculos.length === 0 && !adding && (
        <p className="text-sm text-slate-400 italic">No tenés vínculos laborales cargados.</p>
      )}

      {/* Lista de vínculos existentes */}
      <div className="space-y-3">
        {vinculos.filter((v) => v.activo).map((v) => (
          <div key={v.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <Building2 size={16} className="text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{v.clinica}</p>
              <p className="text-xs text-slate-400">
                {[v.cargo, v.especialidad].filter(Boolean).join(" • ") || "Sin cargo especificado"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(v.id)}
              disabled={deleting === v.id}
              className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label="Eliminar vínculo"
            >
              {deleting === v.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* Formulario para agregar */}
      {adding && (
        <AddVinculoForm
          onCreated={() => { setAdding(false); onChanged(); }}
          onCancel={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function AddVinculoForm({ onCreated, onCancel }) {
  const [clinica, setClinica] = useState(null);
  const [cargo, setCargo] = useState("");
  const [especialidad, setEspecialidad] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!clinica) { setError("Seleccioná una clínica."); return; }
    setSaving(true);
    setError("");
    try {
      await crearVinculoLaboral({
        clinica_id: clinica.id,
        cargo,
        especialidad,
      });
      onCreated();
    } catch (err) {
      setError(err.data?.detail || "Error al agregar vínculo.");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-teal-50/50 border border-teal-100 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Text className="text-sm font-bold text-teal-700">Nuevo Lugar de Trabajo</Text>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>

      {/* Buscar clínica */}
      {!clinica ? (
        <EntitySearchField
          label="Clínica / Consultorio"
          placeholder="Buscar por nombre..."
          fetchFn={buscarClinicas}
          onSelect={setClinica}
          renderItem={(item) => (
            <span>{item.nombre_comercial || item.razon_social} {item.nombre_comercial && <span className="text-slate-400 text-xs">({item.razon_social})</span>}</span>
          )}
        />
      ) : (
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-teal-200">
          <Building2 size={14} className="text-teal-600" />
          <span className="text-sm font-medium text-slate-700">{clinica.nombre_comercial || clinica.razon_social}</span>
          <button type="button" onClick={() => setClinica(null)} className="ml-auto text-slate-400 hover:text-red-500">
            <X size={12} />
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cargo</label>
          <input
            type="text"
            value={cargo}
            onChange={(e) => setCargo(e.target.value)}
            placeholder="Ej: Director Clínico, Asociado..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Especialidad</label>
          <input
            type="text"
            value={especialidad}
            onChange={(e) => setEspecialidad(e.target.value)}
            placeholder="Ej: Endodoncia, Ortodoncia..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Cancelar</button>
        <button
          type="submit"
          disabled={!clinica || saving}
          className="flex items-center gap-1.5 rounded-xl bg-teal-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-teal-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar
        </button>
      </div>
    </form>
  );
}


// ─── Vínculos Docentes ──────────────────────────────────────────────

function VinculosDocentesSection({ vinculos, onChanged }) {
  const [adding, setAdding] = useState(false);
  const [deleting, setDeleting] = useState(null);

  async function handleDelete(id) {
    setDeleting(id);
    try {
      await eliminarVinculoDocente(id);
      onChanged();
    } catch { /* silenciar */ }
    finally { setDeleting(null); }
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2.5">
          <BookOpen size={18} className="text-dental-blue" />
          <Heading level={4} className="text-lg">Docencia</Heading>
        </div>
        {!adding && (
          <button
            type="button"
            onClick={() => setAdding(true)}
            className="flex items-center gap-1.5 text-sm font-semibold text-dental-blue hover:text-dental-blue/80 transition-colors"
          >
            <Plus size={14} /> Agregar
          </button>
        )}
      </div>

      {vinculos.length === 0 && !adding && (
        <p className="text-sm text-slate-400 italic">No tenés vínculos docentes cargados.</p>
      )}

      {/* Lista de vínculos existentes */}
      <div className="space-y-3">
        {vinculos.filter((v) => v.activo).map((v) => (
          <div key={v.id} className="flex items-center gap-3 bg-slate-50 rounded-xl px-4 py-3">
            <BookOpen size={16} className="text-slate-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-slate-700 truncate">{v.institucion}</p>
              <p className="text-xs text-slate-400">
                {[v.catedra, v.tipo_display, v.oferta_academica].filter(Boolean).join(" • ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(v.id)}
              disabled={deleting === v.id}
              className="text-slate-300 hover:text-red-500 transition-colors disabled:opacity-50"
              aria-label="Eliminar vínculo docente"
            >
              {deleting === v.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
            </button>
          </div>
        ))}
      </div>

      {/* Formulario para agregar */}
      {adding && (
        <AddVinculoDocenteForm
          onCreated={() => { setAdding(false); onChanged(); }}
          onCancel={() => setAdding(false)}
        />
      )}
    </div>
  );
}

function AddVinculoDocenteForm({ onCreated, onCancel }) {
  const [institucion, setInstitucion] = useState(null);
  const [ofertas, setOfertas] = useState([]);
  const [form, setForm] = useState({
    oferta_academica_id: "",
    catedra: "",
    tipo: "titular",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!institucion) { setOfertas([]); return; }
    getOfertasAcademicas(institucion.id).then(setOfertas).catch(() => setOfertas([]));
  }, [institucion]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!institucion) { setError("Seleccioná una institución."); return; }
    setSaving(true);
    setError("");
    try {
      await crearVinculoDocente({
        institucion_id: institucion.id,
        oferta_academica_id: form.oferta_academica_id || null,
        catedra: form.catedra,
        tipo: form.tipo,
      });
      onCreated();
    } catch (err) {
      setError(err.data?.detail || "Error al agregar vínculo docente.");
    } finally { setSaving(false); }
  }

  return (
    <form onSubmit={handleSubmit} className="mt-4 bg-purple-50/50 border border-purple-100 rounded-xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <Text className="text-sm font-bold text-purple-700">Nuevo Vínculo Docente</Text>
        <button type="button" onClick={onCancel} className="text-slate-400 hover:text-slate-600"><X size={16} /></button>
      </div>

      {/* Buscar institución */}
      {!institucion ? (
        <EntitySearchField
          label="Institución"
          placeholder="Buscar universidad, instituto..."
          fetchFn={buscarInstituciones}
          onSelect={setInstitucion}
          renderItem={(item) => (
            <span>{item.razon_social} {item.abreviatura && <span className="text-slate-400">({item.abreviatura})</span>}</span>
          )}
        />
      ) : (
        <div className="flex items-center gap-2 bg-white rounded-xl px-4 py-2.5 border border-purple-200">
          <Building2 size={14} className="text-purple-600" />
          <span className="text-sm font-medium text-slate-700">{institucion.razon_social}</span>
          <button type="button" onClick={() => { setInstitucion(null); setOfertas([]); setForm(f => ({ ...f, oferta_academica_id: "" })); }} className="ml-auto text-slate-400 hover:text-red-500">
            <X size={12} />
          </button>
        </div>
      )}

      {/* Oferta académica (si hay opciones) */}
      {institucion && ofertas.length > 0 && (
        <SelectField
          label="Carrera / Programa (opcional)"
          value={form.oferta_academica_id}
          onChange={(v) => setForm((f) => ({ ...f, oferta_academica_id: v }))}
          options={[{ value: "", label: "— Sin especificar —" }, ...ofertas.map((o) => ({ value: o.id, label: o.nombre }))]}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SelectField
          label="Tipo de cargo"
          value={form.tipo}
          onChange={(v) => setForm((f) => ({ ...f, tipo: v }))}
          options={TIPO_DOCENTE_OPTIONS}
        />
        <div className="space-y-1.5">
          <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cátedra / Materia</label>
          <input
            type="text"
            value={form.catedra}
            onChange={(e) => setForm((f) => ({ ...f, catedra: e.target.value }))}
            placeholder="Ej: Ortodoncia II, Endodoncia..."
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-700 focus:border-dental-blue focus:ring-1 focus:ring-dental-blue outline-none transition-colors"
          />
        </div>
      </div>

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm font-medium text-slate-500 hover:text-slate-700">Cancelar</button>
        <button
          type="submit"
          disabled={!institucion || saving}
          className="flex items-center gap-1.5 rounded-xl bg-purple-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          Agregar
        </button>
      </div>
    </form>
  );
}


// ─── Alertas de categoría ───────────────────────────────────────────

/**
 * Muestra alertas contextuales si la categoría seleccionada
 * no tiene los requisitos completados (registro, formación, docencia).
 */
function CategoriaAlerts({ datosCliente }) {
  if (!datosCliente || datosCliente.tipo_cuenta !== "persona") return null;

  const { categoria, registro_profesional, formaciones = [], vinculos_docentes = [], tier_precio } = datosCliente;
  const alerts = [];

  // Odontólogo o Protesista sin registro profesional
  if ((categoria === "odontologo" || categoria === "protesista") && !registro_profesional) {
    alerts.push({
      key: "registro",
      icon: Stethoscope,
      color: "amber",
      message: `Categoría "${categoria === "odontologo" ? "Odontólogo" : "Protesista"}" sin registro profesional. Completá tu Nro. de Matrícula en la sección Registro Profesional para verificar tu condición.`,
    });
  }

  // Estudiante sin formación de grado vigente
  if (categoria === "estudiante") {
    const tieneGradoVigente = formaciones.some((f) => f.tipo === "grado" && f.vigente);
    if (!tieneGradoVigente) {
      alerts.push({
        key: "formacion",
        icon: GraduationCap,
        color: "amber",
        message: "Categoría \"Estudiante\" requiere una formación de grado vigente (dentro del período de la carrera). Agregala en la sección Formación Académica.",
      });
    }

    // Estudiante con formación pero sin tier de estudiante activo
    if (tieneGradoVigente && tier_precio !== "estudiante") {
      alerts.push({
        key: "descuento_estudiante",
        icon: Info,
        color: "blue",
        message: "Ya tenés tu formación cargada. Para activar tu descuento de estudiante, contactá a un asesor de ventas para que valide tu constancia y habilite el precio especial en tus compras.",
      });
    }
  }

  // Profesor sin vínculo docente activo
  if (categoria === "profesor") {
    const tieneDocenteActivo = vinculos_docentes.some((v) => v.activo);
    if (!tieneDocenteActivo) {
      alerts.push({
        key: "docente",
        icon: BookOpen,
        color: "amber",
        message: "Categoría \"Profesor\" sin vínculo docente activo. Agregá un vínculo docente en la sección Docencia.",
      });
    }
  }

  if (alerts.length === 0) return null;

  return (
    <div className="space-y-3">
      {alerts.map(({ key, icon: Icon, color, message }) => (
        <div
          key={key}
          className={`flex items-start gap-3 rounded-2xl border p-4 ${
            color === "amber"
              ? "bg-amber-50 border-amber-200"
              : "bg-blue-50 border-blue-200"
          }`}
        >
          <Icon size={18} className={`shrink-0 mt-0.5 ${color === "amber" ? "text-amber-600" : "text-blue-600"}`} />
          <div className="flex-1 min-w-0">
            <p className={`text-sm font-medium ${color === "amber" ? "text-amber-800" : "text-blue-800"}`}>
              {message}
            </p>
          </div>
          <Info size={14} className={`shrink-0 mt-0.5 ${color === "amber" ? "text-amber-400" : "text-blue-400"}`} />
        </div>
      ))}
    </div>
  );
}


// ─── Validación ─────────────────────────────────────────────────────

/**
 * Valida los campos personales antes de enviar al backend.
 * Retorna un objeto { campo: "mensaje" } con los errores encontrados.
 */
function validarDatosPersonales(form, esPersona) {
  const errores = {};

  // Validar cédula (si se ingresó, solo dígitos y puntos, mínimo 5 caracteres)
  if (esPersona && form.cedula) {
    const cedulaLimpia = form.cedula.replace(/\./g, "");
    if (!/^\d+$/.test(cedulaLimpia)) {
      errores.cedula = "La cédula solo debe contener números (y opcionalmente puntos como separador).";
    } else if (cedulaLimpia.length < 5 || cedulaLimpia.length > 10) {
      errores.cedula = "La cédula debe tener entre 5 y 10 dígitos.";
    }
  }

  // Validar fecha de nacimiento
  if (esPersona && form.fecha_nacimiento) {
    const fecha = new Date(form.fecha_nacimiento);
    const hoy = new Date();
    const edad = hoy.getFullYear() - fecha.getFullYear();

    if (isNaN(fecha.getTime())) {
      errores.fecha_nacimiento = "Fecha inválida.";
    } else if (fecha > hoy) {
      errores.fecha_nacimiento = "La fecha de nacimiento no puede ser futura.";
    } else if (edad > 120) {
      errores.fecha_nacimiento = "La fecha de nacimiento no es válida (edad mayor a 120 años).";
    } else if (edad < 16) {
      errores.fecha_nacimiento = "Debés tener al menos 16 años.";
    }
  }

  // Validar documento extranjero si es extranjero
  if (esPersona && form.es_extranjero && form.documento_extranjero) {
    if (form.documento_extranjero.trim().length < 3) {
      errores.documento_extranjero = "El documento extranjero debe tener al menos 3 caracteres.";
    } else if (form.documento_extranjero.trim().length > 50) {
      errores.documento_extranjero = "El documento extranjero es demasiado largo (máx. 50 caracteres).";
    }
  }

  return errores;
}

/**
 * Extrae mensajes de error legibles del objeto de respuesta del backend.
 * DRF puede retornar:
 * - { detail: "mensaje" }
 * - { campo: ["error1", "error2"] }
 * - { non_field_errors: ["error1"] }
 */
function extraerErrores(err) {
  const data = err?.data;
  if (!data) return { general: "No se pudo conectar con el servidor. Verificá tu conexión e intentá de nuevo." };

  // Si hay un "detail" directo
  if (data.detail) return { general: data.detail };

  // Si hay non_field_errors
  if (data.non_field_errors) return { general: data.non_field_errors.join(". ") };

  // Errores por campo
  const erroresCampo = {};
  let hayAlguno = false;
  for (const [campo, mensajes] of Object.entries(data)) {
    if (Array.isArray(mensajes)) {
      erroresCampo[campo] = mensajes.join(". ");
      hayAlguno = true;
    } else if (typeof mensajes === "string") {
      erroresCampo[campo] = mensajes;
      hayAlguno = true;
    }
  }

  if (hayAlguno) {
    // Generar mensaje general combinando los errores de campo
    const resumen = Object.entries(erroresCampo)
      .map(([campo, msg]) => `${LABELS_CAMPO[campo] || campo}: ${msg}`)
      .join(" • ");
    return { ...erroresCampo, general: resumen };
  }

  return { general: "Ocurrió un error inesperado al guardar. Intentá de nuevo." };
}

// Labels legibles para nombres de campo del backend
const LABELS_CAMPO = {
  cedula: "Cédula",
  fecha_nacimiento: "Fecha de nacimiento",
  tratamiento: "Tratamiento",
  categoria: "Categoría",
  departamento: "Departamento",
  ciudad: "Ciudad",
  direccion: "Dirección",
  documento_extranjero: "Documento extranjero",
  es_extranjero: "Es extranjero",
  latitud: "Latitud",
  longitud: "Longitud",
};

// ─── Componente de error inline por campo ───────────────────────────

function FieldError({ error }) {
  if (!error) return null;
  return (
    <p className="mt-1 text-xs text-red-500 font-medium flex items-center gap-1">
      <AlertCircle size={11} className="shrink-0" />
      {error}
    </p>
  );
}

// ─── Página Principal ───────────────────────────────────────────────

export default function DatosPage() {
  const { cliente, refreshPerfil } = useAuth();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [creandoDireccion, setCreandoDireccion] = useState(false);
  const [direccionMsg, setDireccionMsg] = useState(null);

  const fetchPerfil = useCallback(async () => {
    try { setPerfilData(await getPerfil()); }
    catch { setPerfilData(cliente); }
    finally { setLoading(false); }
  }, [cliente]);

  useEffect(() => { fetchPerfil(); }, [fetchPerfil]);

  const datosCliente = perfilData || cliente;
  const esPersona = datosCliente?.tipo_cuenta === "persona";

  const [form, setForm] = useState({});

  useEffect(() => {
    if (datosCliente) {
      setForm({
        departamento: datosCliente.departamento || "",
        ciudad: datosCliente.ciudad || "",
        direccion: datosCliente.direccion || "",
        latitud: datosCliente.latitud || null,
        longitud: datosCliente.longitud || null,
        tratamiento: datosCliente.tratamiento || "",
        cedula: datosCliente.cedula || "",
        fecha_nacimiento: datosCliente.fecha_nacimiento || "",
        categoria: datosCliente.categoria || "",
        es_extranjero: datosCliente.es_extranjero || false,
        documento_extranjero: datosCliente.documento_extranjero || "",
      });
    }
  }, [datosCliente]);

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    // Limpiar error del campo al editar
    if (fieldErrors[field]) {
      setFieldErrors((prev) => { const next = { ...prev }; delete next[field]; return next; });
    }
  }

  async function handleUsarComoEnvio() {
    setCreandoDireccion(true);
    setDireccionMsg(null);
    try {
      await crearDireccion({
        etiqueta: "Dirección Fiscal",
        nombre_destinatario: datosCliente?.razon_social || "",
        telefono_contacto: datosCliente?.telefono || "",
        departamento: form.departamento,
        ciudad: form.ciudad,
        barrio: "",
        direccion: form.direccion,
        ...(form.latitud && form.longitud ? { latitud: form.latitud, longitud: form.longitud } : {}),
      });
      setDireccionMsg({ tipo: "ok", texto: "Agregada a tus direcciones de envío." });
      setTimeout(() => setDireccionMsg(null), 4000);
    } catch (err) {
      setDireccionMsg({ tipo: "error", texto: err.data?.detail || err.data?.non_field_errors?.[0] || "No se pudo agregar la dirección de envío." });
    } finally {
      setCreandoDireccion(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSuccessMsg("");
    setErrorMsg("");
    setFieldErrors({});

    // Validación frontend
    const erroresValidacion = validarDatosPersonales(form, esPersona);
    if (Object.keys(erroresValidacion).length > 0) {
      setFieldErrors(erroresValidacion);
      setErrorMsg("Corregí los campos marcados antes de guardar.");
      return;
    }

    setSaving(true);
    try {
      const updated = await updatePerfil(form);
      setPerfilData(updated);
      await refreshPerfil();
      setSuccessMsg("Datos actualizados correctamente.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      const errores = extraerErrores(err);
      setErrorMsg(errores.general);
      // Poner errores por campo si el backend los devolvió
      const { general, ...campoErrors } = errores;
      if (Object.keys(campoErrors).length > 0) {
        setFieldErrors(campoErrors);
      }
    } finally { setSaving(false); }
  }

  // Callback para refrescar perfil cuando se actualizan relaciones
  async function handleRelacionesChanged() {
    const updated = await getPerfil();
    setPerfilData(updated);
    await refreshPerfil();
  }

  if (loading) return <LoadingScreen message="Cargando datos..." />;

  return (
    <CuentaPageWrapper title="Mis Datos" description="Información personal, contacto y vínculos profesionales.">
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Contacto (datos de verificación — bloqueados una vez vinculados) */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <Heading level={4} className="text-lg">Datos de Contacto</Heading>
            {(datosCliente?.telefono && datosCliente?.correo_electronico) && (
              <div className="flex items-center gap-1.5 text-emerald-600 bg-emerald-50 rounded-lg px-3 py-1.5">
                <Check size={12} />
                <span className="text-[11px] font-semibold">Todo verificado</span>
              </div>
            )}
          </div>
          <p className="text-xs text-slate-400 mb-4">
            Estos datos están vinculados a tu cuenta. Una vez verificados, no se pueden modificar.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Teléfono */}
            {datosCliente?.telefono ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Teléfono / Celular</label>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Check size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Verificado</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"><Phone size={16} /></div>
                  <div className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5 pl-10 text-sm text-slate-600 select-none">
                    {datosCliente.telefono}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"><Check size={14} /></div>
                </div>
              </div>
            ) : (
              <VincularContactoField tipo="telefono" onVinculado={async () => { setPerfilData(await getPerfil()); await refreshPerfil(); }} />
            )}

            {/* Email */}
            {datosCliente?.correo_electronico ? (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Email</label>
                  <div className="flex items-center gap-1 text-emerald-600">
                    <Check size={12} />
                    <span className="text-[10px] font-bold uppercase tracking-wide">Verificado</span>
                  </div>
                </div>
                <div className="relative">
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-300"><Mail size={16} /></div>
                  <div className="w-full rounded-xl border border-emerald-100 bg-emerald-50/50 px-4 py-2.5 pl-10 text-sm text-slate-600 select-none">
                    {datosCliente.correo_electronico}
                  </div>
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 text-emerald-400"><Check size={14} /></div>
                </div>
              </div>
            ) : (
              <VincularContactoField tipo="email" onVinculado={async () => { setPerfilData(await getPerfil()); await refreshPerfil(); }} />
            )}
          </div>
        </div>

        {/* Dirección Fiscal */}
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <Heading level={4} className="text-lg mb-6">Dirección Fiscal</Heading>

          <UbicacionPicker
            departamento={form.departamento}
            ciudad={form.ciudad}
            direccion={form.direccion}
            latitud={form.latitud}
            longitud={form.longitud}
            onChange={({ departamento, ciudad, direccion, latitud, longitud }) => {
              setForm((prev) => ({ ...prev, departamento, ciudad, direccion, latitud, longitud }));
            }}
            mapHeight="350px"
          />

          {/* Botón para usar como dirección de envío */}
          {(form.departamento && form.ciudad && form.direccion) && (
            <div className="mt-5 pt-5 border-t border-slate-100">
              <button
                type="button"
                onClick={handleUsarComoEnvio}
                disabled={creandoDireccion}
                className="flex items-center gap-2 text-sm font-medium text-dental-blue hover:text-dental-blue/80 transition-colors disabled:opacity-50"
              >
                {creandoDireccion ? <Loader2 size={15} className="animate-spin" /> : <Truck size={15} />}
                Usar como dirección de envío
              </button>
              {direccionMsg && <p className={`mt-2 text-xs font-medium ${direccionMsg.tipo === "ok" ? "text-emerald-600" : "text-red-500"}`}>{direccionMsg.texto}</p>}
            </div>
          )}
        </div>

        {/* Datos personales */}
        {esPersona && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Heading level={4} className="text-lg mb-6">Datos Personales</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <SelectField label="Tratamiento" value={form.tratamiento} onChange={(v) => handleChange("tratamiento", v)} options={TRATAMIENTOS} icon={User} />
              <SelectField label="Categoría profesional" value={form.categoria} onChange={(v) => handleChange("categoria", v)} options={CATEGORIAS} icon={Stethoscope} />
              <div>
                <Input label="Cédula de Identidad" value={form.cedula} onChange={(e) => handleChange("cedula", e.target.value)} placeholder="Ej: 4.567.890" icon={FileText} />
                <FieldError error={fieldErrors.cedula} />
              </div>
              <div>
                <Input label="Fecha de Nacimiento" type="date" value={form.fecha_nacimiento} onChange={(e) => handleChange("fecha_nacimiento", e.target.value)} icon={Calendar} />
                <FieldError error={fieldErrors.fecha_nacimiento} />
              </div>
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.es_extranjero} onChange={(e) => handleChange("es_extranjero", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-dental-blue focus:ring-dental-blue" />
                  <div className="flex items-center gap-2"><Globe size={16} className="text-slate-400" /><span className="text-sm font-medium text-slate-600">Soy extranjero/a</span></div>
                </label>
                {form.es_extranjero && (
                  <div>
                    <Input label="Documento extranjero" value={form.documento_extranjero} onChange={(e) => handleChange("documento_extranjero", e.target.value)} placeholder="Pasaporte o CI extranjera" icon={Globe} />
                    <FieldError error={fieldErrors.documento_extranjero} />
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Registro profesional (solo lectura) */}
        {esPersona && datosCliente?.registro_profesional && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <Heading level={4} className="text-lg mb-6">Registro Profesional</Heading>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div><Text variant="label" className="text-slate-400">Matrícula</Text><Text variant="bodySmBold">{datosCliente.registro_profesional.numero || "—"}</Text></div>
              <div><Text variant="label" className="text-slate-400">Colegio</Text><Text variant="bodySmBold">{datosCliente.registro_profesional.colegio || "—"}</Text></div>
            </div>
          </div>
        )}

        {/* Mensajes */}
        {successMsg && <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-100 p-4"><Check size={20} className="text-emerald-600 shrink-0" /><Text variant="bodySm" className="font-bold text-emerald-600">{successMsg}</Text></div>}
        {errorMsg && (
          <div className="flex items-start gap-3 rounded-2xl bg-red-50 border border-red-100 p-4">
            <AlertCircle size={20} className="text-red-600 shrink-0 mt-0.5" />
            <div>
              <Text variant="bodySm" className="font-bold text-red-600">{errorMsg}</Text>
              {Object.keys(fieldErrors).length > 0 && (
                <p className="text-xs text-red-400 mt-1">Revisá los campos resaltados arriba para corregir los errores.</p>
              )}
            </div>
          </div>
        )}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" icon={saving ? Loader2 : Save} className={`rounded-xl px-8 ${saving ? "[&>svg]:animate-spin" : ""}`}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>

      {/* ─── Alertas de categoría (completar perfil) ─── */}
      {esPersona && (
        <div className="mt-8">
          <CategoriaAlerts datosCliente={datosCliente} />
        </div>
      )}

      {/* ─── Verificación de tipo de entidad ─── */}
      {datosCliente?.tipo_entidad_declarado && (
        <div className="mt-8">
          <SeccionVerificacion
            cliente={datosCliente}
            onUpdated={handleRelacionesChanged}
          />
        </div>
      )}

      {/* ─── Secciones fuera del form (no disparan submit) ─── */}

      {/* Formaciones Académicas */}
      {esPersona && (
        <div className="mt-8">
          <FormacionesSection
            formaciones={datosCliente?.formaciones || []}
            onChanged={handleRelacionesChanged}
          />
        </div>
      )}

      {/* Vínculos Laborales */}
      {esPersona && (
        <div className="mt-6">
          <VinculosSection
            vinculos={datosCliente?.vinculos_laborales || []}
            onChanged={handleRelacionesChanged}
          />
        </div>
      )}

      {/* Vínculos Docentes */}
      {esPersona && (
        <div className="mt-6">
          <VinculosDocentesSection
            vinculos={datosCliente?.vinculos_docentes || []}
            onChanged={handleRelacionesChanged}
          />
        </div>
      )}
    </CuentaPageWrapper>
  );
}
