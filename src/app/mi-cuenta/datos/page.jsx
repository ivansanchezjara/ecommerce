"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/app/context/AuthContext";
import { getPerfil, updatePerfil, enviarCodigo, verificarCodigo, vincularContacto } from "@/services/auth";
import { crearDireccion } from "@/services/cuenta";
import { LoadingScreen, Button, Input } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  User, Mail, Phone, MapPin, Building2,
  Save, Loader2, Check, AlertCircle, Globe,
  FileText, Calendar, Stethoscope, Plus, SendHorizontal, Truck,
} from "lucide-react";
import CuentaPageWrapper from "@/components/cuenta/CuentaPageWrapper";

const MapaPicker = dynamic(() => import("@/components/ui/basics/MapaPicker"), { ssr: false });

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

const DEPARTAMENTOS_PY = [
  "Asunción", "Central", "Alto Paraná", "Itapúa", "Caaguazú", "San Pedro",
  "Paraguarí", "Guairá", "Cordillera", "Concepción", "Amambay", "Canindeyú",
  "Misiones", "Ñeembucú", "Presidente Hayes", "Caazapá", "Alto Paraguay", "Boquerón",
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
      // Ahora vincular el contacto
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

export default function DatosPage() {
  const { cliente, refreshPerfil } = useAuth();
  const [perfilData, setPerfilData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [creandoDireccion, setCreandoDireccion] = useState(false);
  const [direccionMsg, setDireccionMsg] = useState(null);

  useEffect(() => {
    async function fetch() {
      try { setPerfilData(await getPerfil()); }
      catch { setPerfilData(cliente); }
      finally { setLoading(false); }
    }
    fetch();
  }, [cliente]);

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

  function handleChange(field, value) { setForm((prev) => ({ ...prev, [field]: value })); }

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
      setDireccionMsg({ tipo: "error", texto: err.data?.detail || err.data?.non_field_errors?.[0] || "No se pudo agregar." });
    } finally {
      setCreandoDireccion(false);
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true); setSuccessMsg(""); setErrorMsg("");
    try {
      const updated = await updatePerfil(form);
      setPerfilData(updated);
      await refreshPerfil();
      setSuccessMsg("Datos actualizados correctamente.");
      setTimeout(() => setSuccessMsg(""), 4000);
    } catch (err) {
      setErrorMsg(err.data?.detail || "Error al guardar los cambios.");
    } finally { setSaving(false); }
  }

  if (loading) return <LoadingScreen message="Cargando datos..." />;

  return (
    <CuentaPageWrapper title="Mis Datos" description="Información personal, contacto y ubicación.">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <SelectField label="Departamento" value={form.departamento} onChange={(v) => handleChange("departamento", v)} options={[{ value: "", label: "Seleccionar" }, ...DEPARTAMENTOS_PY.map((d) => ({ value: d, label: d }))]} icon={MapPin} />
            <Input label="Ciudad" value={form.ciudad} onChange={(e) => handleChange("ciudad", e.target.value)} placeholder="Ej: Asunción" icon={MapPin} />
            <div className="md:col-span-2">
              <Input label="Dirección completa" value={form.direccion} onChange={(e) => handleChange("direccion", e.target.value)} placeholder="Calle, número, barrio..." icon={Building2} />
            </div>
          </div>

          {/* Mapa interactivo */}
          <div className="mt-5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2 block">Ubicación en mapa</label>
            <MapaPicker
              latitud={form.latitud}
              longitud={form.longitud}
              centerOn={form.ciudad && form.departamento ? `${form.ciudad}, ${form.departamento}` : ""}
              onChange={({ lat, lng, departamentoRaw, ciudad, direccion }) => {
                setForm((prev) => ({
                  ...prev,
                  latitud: lat,
                  longitud: lng,
                  ...(departamentoRaw && !prev.departamento ? { departamento: departamentoRaw } : {}),
                  ...(ciudad && !prev.ciudad ? { ciudad } : {}),
                  ...(direccion && !prev.direccion ? { direccion } : {}),
                }));
              }}
              height="220px"
            />
          </div>

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
              <Input label="Cédula de Identidad" value={form.cedula} onChange={(e) => handleChange("cedula", e.target.value)} placeholder="Ej: 4.567.890" icon={FileText} />
              <Input label="Fecha de Nacimiento" type="date" value={form.fecha_nacimiento} onChange={(e) => handleChange("fecha_nacimiento", e.target.value)} icon={Calendar} />
              <div className="md:col-span-2 space-y-4">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input type="checkbox" checked={form.es_extranjero} onChange={(e) => handleChange("es_extranjero", e.target.checked)} className="w-4 h-4 rounded border-slate-300 text-dental-blue focus:ring-dental-blue" />
                  <div className="flex items-center gap-2"><Globe size={16} className="text-slate-400" /><span className="text-sm font-medium text-slate-600">Soy extranjero/a</span></div>
                </label>
                {form.es_extranjero && <Input label="Documento extranjero" value={form.documento_extranjero} onChange={(e) => handleChange("documento_extranjero", e.target.value)} placeholder="Pasaporte o CI extranjera" icon={Globe} />}
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
        {successMsg && <div className="flex items-center gap-3 rounded-2xl bg-emerald-50 p-4"><Check size={20} className="text-emerald-600" /><Text variant="bodySm" className="font-bold text-emerald-600">{successMsg}</Text></div>}
        {errorMsg && <div className="flex items-center gap-3 rounded-2xl bg-red-50 p-4"><AlertCircle size={20} className="text-red-600" /><Text variant="bodySm" className="font-bold text-red-600">{errorMsg}</Text></div>}

        <div className="flex justify-end">
          <Button type="submit" disabled={saving} size="lg" icon={saving ? Loader2 : Save} className={`rounded-xl px-8 ${saving ? "[&>svg]:animate-spin" : ""}`}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </Button>
        </div>
      </form>
    </CuentaPageWrapper>
  );
}
