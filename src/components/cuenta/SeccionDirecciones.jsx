"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import {
  getDirecciones,
  crearDireccion,
  actualizarDireccion,
  eliminarDireccion,
  marcarDireccionPrincipal,
} from "@/services/cuenta";
import { Button, Input, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  MapPin,
  Plus,
  Pencil,
  Trash2,
  Star,
  Phone,
  User,
  Building2,
  Loader2,
  AlertCircle,
  Check,
} from "lucide-react";

// Leaflet no soporta SSR
const MapaPicker = dynamic(() => import("@/components/ui/basics/MapaPicker"), { ssr: false });

// ─── Constantes ──────────────────────────────────────────────────────────────

const DEPARTAMENTOS_PY = [
  "Asunción",
  "Central",
  "Alto Paraná",
  "Itapúa",
  "Caaguazú",
  "San Pedro",
  "Paraguarí",
  "Guairá",
  "Cordillera",
  "Concepción",
  "Amambay",
  "Canindeyú",
  "Misiones",
  "Ñeembucú",
  "Presidente Hayes",
  "Caazapá",
  "Alto Paraguay",
  "Boquerón",
];

const ETIQUETAS_SUGERIDAS = [
  "Casa",
  "Consultorio",
  "Oficina",
  "Clínica",
  "Laboratorio",
  "Otro",
];

// ─── Formulario de dirección ─────────────────────────────────────────────────

function DireccionForm({ direccion, onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    etiqueta: direccion?.etiqueta || "",
    nombre_destinatario: direccion?.nombre_destinatario || "",
    telefono_contacto: direccion?.telefono_contacto || "",
    departamento: direccion?.departamento || "",
    ciudad: direccion?.ciudad || "",
    barrio: direccion?.barrio || "",
    direccion: direccion?.direccion || "",
    latitud: direccion?.latitud || null,
    longitud: direccion?.longitud || null,
    es_principal: direccion?.es_principal || false,
  });

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Etiqueta */}
      <div className="space-y-2">
        <Text variant="label">Etiqueta</Text>
        <div className="flex flex-wrap gap-2">
          {ETIQUETAS_SUGERIDAS.map((etiqueta) => (
            <button
              key={etiqueta}
              type="button"
              onClick={() => handleChange("etiqueta", etiqueta)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                form.etiqueta === etiqueta
                  ? "bg-dental-blue text-white shadow-sm"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {etiqueta}
            </button>
          ))}
        </div>
        <Input
          value={form.etiqueta}
          onChange={(e) => handleChange("etiqueta", e.target.value)}
          placeholder="Ej: Casa, Consultorio, etc."
          icon={MapPin}
        />
      </div>

      {/* Destinatario y teléfono */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Nombre del destinatario"
          value={form.nombre_destinatario}
          onChange={(e) => handleChange("nombre_destinatario", e.target.value)}
          placeholder="Quién recibe en esta dirección"
          icon={User}
          required
        />
        <Input
          label="Teléfono de contacto"
          type="tel"
          value={form.telefono_contacto}
          onChange={(e) => handleChange("telefono_contacto", e.target.value)}
          placeholder="+595 981 123456"
          icon={Phone}
          required
        />
      </div>

      {/* Ubicación */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Text variant="label">Departamento</Text>
          <select
            value={form.departamento}
            onChange={(e) => handleChange("departamento", e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
            required
          >
            <option value="">Seleccionar departamento</option>
            {DEPARTAMENTOS_PY.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>
        <Input
          label="Ciudad"
          value={form.ciudad}
          onChange={(e) => handleChange("ciudad", e.target.value)}
          placeholder="Ej: San Lorenzo, Lambaré..."
          icon={MapPin}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label="Barrio"
          value={form.barrio}
          onChange={(e) => handleChange("barrio", e.target.value)}
          placeholder="Nombre del barrio (opcional)"
          icon={Building2}
        />
      </div>

      {/* Dirección completa */}
      <div className="space-y-1.5">
        <Text variant="label">Dirección completa</Text>
        <textarea
          value={form.direccion}
          onChange={(e) => handleChange("direccion", e.target.value)}
          placeholder="Calle, número, entre calles, referencias para el delivery..."
          rows={3}
          required
          className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3.5 py-2.5 text-sm font-medium text-slate-700 placeholder:text-slate-400 focus:bg-white focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
        />
      </div>

      {/* Mapa interactivo */}
      <div className="space-y-1.5">
        <Text variant="label">Ubicación en mapa</Text>
        <MapaPicker
          latitud={form.latitud}
          longitud={form.longitud}
          centerOn={[form.ciudad, form.departamento].filter(Boolean).join(", ")}
          onChange={({ lat, lng, departamentoRaw, ciudad, direccion, barrio }) => {
            setForm((prev) => {
              const update = { ...prev, latitud: lat, longitud: lng };
              if (departamentoRaw) {
                const deptoNorm = departamentoRaw.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                const match = DEPARTAMENTOS_PY.find(
                  (d) => d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === deptoNorm
                ) || DEPARTAMENTOS_PY.find(
                  (d) => {
                    const dn = d.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
                    return deptoNorm.includes(dn) || dn.includes(deptoNorm);
                  }
                );
                if (match) update.departamento = match;
              }
              if (ciudad) update.ciudad = ciudad;
              if (barrio) update.barrio = barrio;
              if (direccion) update.direccion = direccion;
              return update;
            });
          }}
          height="280px"
        />
      </div>

      {/* Principal checkbox */}
      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.es_principal}
          onChange={(e) => handleChange("es_principal", e.target.checked)}
          className="w-4 h-4 rounded border-slate-300 text-dental-blue focus:ring-dental-blue"
        />
        <div className="flex items-center gap-2">
          <Star size={16} className="text-amber-400" />
          <span className="text-sm font-medium text-slate-600">
            Usar como dirección principal
          </span>
        </div>
      </label>

      {/* Acciones */}
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancelar
        </Button>
        <Button
          type="submit"
          disabled={saving}
          icon={saving ? Loader2 : Check}
          className={saving ? "[&>svg]:animate-spin" : ""}
        >
          {saving ? "Guardando..." : direccion ? "Actualizar" : "Guardar Dirección"}
        </Button>
      </div>
    </form>
  );
}

// ─── Tarjeta de dirección ────────────────────────────────────────────────────

function DireccionCard({ direccion, onEdit, onDelete, onMarcarPrincipal }) {
  return (
    <div
      className={`relative rounded-2xl border p-5 transition-all ${
        direccion.es_principal
          ? "border-dental-blue/30 bg-blue-50/50 shadow-sm"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Badge principal */}
      {direccion.es_principal && (
        <Badge variant="info" className="absolute top-3 right-3 text-[10px]">
          <Star size={10} className="mr-1" />
          Principal
        </Badge>
      )}

      {/* Etiqueta */}
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
          <MapPin size={16} />
        </div>
        <Heading level={5} className="text-sm">
          {direccion.etiqueta}
        </Heading>
      </div>

      {/* Datos */}
      <div className="space-y-1.5 mb-4">
        <Text variant="bodySm" className="text-slate-600">
          <span className="font-semibold">{direccion.nombre_destinatario}</span>
        </Text>
        <Text variant="bodySm" className="text-slate-500">
          {direccion.direccion}
        </Text>
        <Text variant="bodySm" className="text-slate-400">
          {[direccion.barrio, direccion.ciudad, direccion.departamento]
            .filter(Boolean)
            .join(", ")}
        </Text>
        <Text variant="bodySm" className="text-slate-400">
          {direccion.telefono_contacto}
        </Text>
      </div>

      {/* Acciones */}
      <div className="flex items-center gap-2 border-t border-slate-100 pt-3">
        <button
          onClick={() => onEdit(direccion)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Pencil size={13} />
          Editar
        </button>
        {!direccion.es_principal && (
          <button
            onClick={() => onMarcarPrincipal(direccion.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors"
          >
            <Star size={13} />
            Hacer principal
          </button>
        )}
        <button
          onClick={() => onDelete(direccion.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors ml-auto"
        >
          <Trash2 size={13} />
          Eliminar
        </button>
      </div>
    </div>
  );
}

// ─── Componente principal ────────────────────────────────────────────────────

export default function SeccionDirecciones() {
  const [direcciones, setDirecciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editando, setEditando] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);

  useEffect(() => {
    fetchDirecciones();
  }, []);

  async function fetchDirecciones() {
    try {
      setLoading(true);
      const data = await getDirecciones();
      setDirecciones(data);
    } catch (err) {
      setError("Error al cargar las direcciones.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCreate(formData) {
    setSaving(true);
    setError("");
    try {
      await crearDireccion(formData);
      setShowForm(false);
      await fetchDirecciones();
    } catch (err) {
      setError(err.data?.detail || err.data?.etiqueta?.[0] || "Error al crear la dirección.");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpdate(formData) {
    setSaving(true);
    setError("");
    try {
      await actualizarDireccion(editando.id, formData);
      setEditando(null);
      await fetchDirecciones();
    } catch (err) {
      setError(err.data?.detail || "Error al actualizar la dirección.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      await eliminarDireccion(id);
      setConfirmDelete(null);
      await fetchDirecciones();
    } catch (err) {
      setError("Error al eliminar la dirección.");
    }
  }

  async function handleMarcarPrincipal(id) {
    try {
      await marcarDireccionPrincipal(id);
      await fetchDirecciones();
    } catch (err) {
      setError("Error al marcar como principal.");
    }
  }

  if (loading) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-center py-12">
          <Loader2 size={24} className="animate-spin text-dental-blue" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div>
            <Heading level={4} className="text-lg">
              Mis Direcciones
            </Heading>
            <Text variant="bodySm" className="mt-1">
              Direcciones de envío y entrega guardadas. Máximo 10.
            </Text>
          </div>
          {!showForm && !editando && (
            <Button
              onClick={() => setShowForm(true)}
              icon={Plus}
              size="sm"
              disabled={direcciones.length >= 10}
            >
              Nueva
            </Button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-6 text-red-600">
            <AlertCircle size={18} />
            <Text variant="bodySm" className="font-bold text-red-600">
              {error}
            </Text>
          </div>
        )}

        {/* Formulario de creación */}
        {showForm && (
          <div className="rounded-xl border border-dental-blue/20 bg-blue-50/30 p-6 mb-6">
            <Heading level={5} className="mb-4 text-sm">
              Nueva Dirección
            </Heading>
            <DireccionForm
              onSubmit={handleCreate}
              onCancel={() => setShowForm(false)}
              saving={saving}
            />
          </div>
        )}

        {/* Formulario de edición */}
        {editando && (
          <div className="rounded-xl border border-dental-blue/20 bg-blue-50/30 p-6 mb-6">
            <Heading level={5} className="mb-4 text-sm">
              Editar Dirección
            </Heading>
            <DireccionForm
              direccion={editando}
              onSubmit={handleUpdate}
              onCancel={() => setEditando(null)}
              saving={saving}
            />
          </div>
        )}

        {/* Lista de direcciones */}
        {!showForm && !editando && (
          <>
            {direcciones.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4">
                  <MapPin size={28} className="text-slate-300" />
                </div>
                <Heading level={5} className="text-slate-600">
                  Sin direcciones
                </Heading>
                <Text variant="bodySm" className="mt-2 max-w-sm">
                  Agregá tu primera dirección de envío para agilizar tus
                  compras.
                </Text>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {direcciones.map((dir) => (
                  <DireccionCard
                    key={dir.id}
                    direccion={dir}
                    onEdit={setEditando}
                    onDelete={(id) => setConfirmDelete(id)}
                    onMarcarPrincipal={handleMarcarPrincipal}
                  />
                ))}
              </div>
            )}
          </>
        )}
      </div>

      {/* Modal confirmación de eliminación */}
      {confirmDelete && (
        <Modal
          open={!!confirmDelete}
          onClose={() => setConfirmDelete(null)}
          title="Eliminar dirección"
        >
          <div className="p-6 space-y-4">
            <Text variant="bodySm">
              ¿Estás seguro de que querés eliminar esta dirección? Esta acción
              no se puede deshacer.
            </Text>
            <div className="flex justify-end gap-3">
              <Button
                variant="ghost"
                onClick={() => setConfirmDelete(null)}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(confirmDelete)}
                icon={Trash2}
              >
                Eliminar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
