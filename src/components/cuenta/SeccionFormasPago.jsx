"use client";

import { useState, useEffect } from "react";
import {
  getFormasPago,
  crearFormaPago,
  eliminarFormaPago,
  marcarFormaPagoPrincipal,
} from "@/services/cuenta";
import { Button, Input, Badge, Modal } from "@/components/ui";
import { Heading, Text } from "@/components/ui";
import {
  CreditCard,
  Plus,
  Trash2,
  Star,
  Loader2,
  AlertCircle,
  Check,
  Building2,
  Wallet,
} from "lucide-react";

const TIPOS_PAGO = [
  { value: "tarjeta_credito", label: "Tarjeta de Crédito", icon: CreditCard },
  { value: "tarjeta_debito", label: "Tarjeta de Débito", icon: CreditCard },
  { value: "transferencia", label: "Transferencia Bancaria", icon: Building2 },
  { value: "billetera_digital", label: "Billetera Digital", icon: Wallet },
];

function FormaPagoForm({ onSubmit, onCancel, saving }) {
  const [form, setForm] = useState({
    tipo: "tarjeta_credito",
    etiqueta: "",
    ultimos_digitos: "",
    banco: "",
    titular: "",
    es_principal: false,
  });

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(form);
  }

  const esTarjeta = form.tipo.startsWith("tarjeta");

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Text variant="label">Tipo</Text>
        <div className="grid grid-cols-2 gap-2">
          {TIPOS_PAGO.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setForm((p) => ({ ...p, tipo: t.value }))}
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                form.tipo === t.value
                  ? "border-dental-blue bg-dental-blue/5 text-dental-blue"
                  : "border-slate-200 text-slate-600 hover:border-slate-300"
              }`}
            >
              <t.icon size={14} />
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <Input
        label="Etiqueta"
        value={form.etiqueta}
        onChange={(e) => setForm((p) => ({ ...p, etiqueta: e.target.value }))}
        placeholder="Ej: Visa personal, Itaú empresa..."
        required
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {esTarjeta && (
          <Input
            label="Últimos 4 dígitos"
            value={form.ultimos_digitos}
            onChange={(e) => setForm((p) => ({ ...p, ultimos_digitos: e.target.value.slice(0, 4) }))}
            placeholder="1234"
            maxLength={4}
          />
        )}
        <Input
          label="Banco / Entidad"
          value={form.banco}
          onChange={(e) => setForm((p) => ({ ...p, banco: e.target.value }))}
          placeholder="Ej: Itaú, Continental..."
        />
        <Input
          label="Titular"
          value={form.titular}
          onChange={(e) => setForm((p) => ({ ...p, titular: e.target.value }))}
          placeholder="Nombre en la tarjeta o cuenta"
        />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.es_principal}
          onChange={(e) => setForm((p) => ({ ...p, es_principal: e.target.checked }))}
          className="w-4 h-4 rounded border-slate-300 text-dental-blue focus:ring-dental-blue"
        />
        <span className="text-sm font-medium text-slate-600">Usar como método principal</span>
      </label>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="ghost" onClick={onCancel}>Cancelar</Button>
        <Button type="submit" disabled={saving} icon={saving ? Loader2 : Check} className={saving ? "[&>svg]:animate-spin" : ""}>
          {saving ? "Guardando..." : "Guardar"}
        </Button>
      </div>
    </form>
  );
}

function FormaPagoCard({ forma, onDelete, onMarcarPrincipal }) {
  const tipoInfo = TIPOS_PAGO.find((t) => t.value === forma.tipo) || TIPOS_PAGO[0];
  const Icon = tipoInfo.icon;

  return (
    <div className={`relative rounded-xl border p-4 transition-all ${
      forma.es_principal ? "border-dental-blue/30 bg-blue-50/50" : "border-slate-200 bg-white"
    }`}>
      {forma.es_principal && (
        <Badge variant="info" className="absolute top-3 right-3 text-[10px]">
          <Star size={10} className="mr-1" /> Principal
        </Badge>
      )}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100">
          <Icon size={18} className="text-slate-500" />
        </div>
        <div className="flex-1">
          <Text variant="bodySmBold" className="text-slate-700">{forma.etiqueta}</Text>
          <Text variant="bodySm" className="text-slate-400">
            {tipoInfo.label}
            {forma.ultimos_digitos && ` •••• ${forma.ultimos_digitos}`}
            {forma.banco && ` • ${forma.banco}`}
          </Text>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-3 border-t border-slate-100 pt-3">
        {!forma.es_principal && (
          <button onClick={() => onMarcarPrincipal(forma.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-amber-600 hover:bg-amber-50 transition-colors">
            <Star size={13} /> Hacer principal
          </button>
        )}
        <button onClick={() => onDelete(forma.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold text-red-500 hover:bg-red-50 transition-colors ml-auto">
          <Trash2 size={13} /> Eliminar
        </button>
      </div>
    </div>
  );
}

export default function SeccionFormasPago() {
  const [formas, setFormas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);

  useEffect(() => { fetchData(); }, []);

  async function fetchData() {
    try { setLoading(true); setFormas(await getFormasPago()); }
    catch { setError("Error al cargar formas de pago."); }
    finally { setLoading(false); }
  }

  async function handleCreate(data) {
    setSaving(true); setError("");
    try { await crearFormaPago(data); setShowForm(false); await fetchData(); }
    catch (err) { setError(err.data?.detail || "Error al guardar."); }
    finally { setSaving(false); }
  }

  async function handleDelete(id) {
    try { await eliminarFormaPago(id); await fetchData(); }
    catch { setError("Error al eliminar."); }
  }

  async function handlePrincipal(id) {
    try { await marcarFormaPagoPrincipal(id); await fetchData(); }
    catch { setError("Error al marcar como principal."); }
  }

  if (loading) return <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm"><div className="flex items-center justify-center py-12"><Loader2 size={24} className="animate-spin text-dental-blue" /></div></div>;

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-purple-100"><Wallet size={18} className="text-purple-500" /></div>
            <div>
              <Heading level={4} className="text-lg">Formas de Pago</Heading>
              <Text variant="bodySm" className="mt-0.5">Métodos de pago guardados para tus compras.</Text>
            </div>
          </div>
          {!showForm && <Button onClick={() => setShowForm(true)} icon={Plus} size="sm" disabled={formas.length >= 10}>Nueva</Button>}
        </div>

        {error && <div className="flex items-center gap-3 rounded-xl bg-red-50 p-3 mb-6 text-red-600"><AlertCircle size={18} /><Text variant="bodySm" className="font-bold text-red-600">{error}</Text></div>}

        {showForm && (
          <div className="rounded-xl border border-dental-blue/20 bg-blue-50/30 p-6 mb-6">
            <Heading level={5} className="mb-4 text-sm">Nuevo método de pago</Heading>
            <FormaPagoForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} saving={saving} />
          </div>
        )}

        {!showForm && formas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mb-4"><CreditCard size={28} className="text-purple-300" /></div>
            <Heading level={5} className="text-slate-600">Sin métodos guardados</Heading>
            <Text variant="bodySm" className="mt-2 max-w-sm">Guardá tus métodos de pago favoritos para agilizar el checkout.</Text>
          </div>
        ) : !showForm && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {formas.map((f) => <FormaPagoCard key={f.id} forma={f} onDelete={handleDelete} onMarcarPrincipal={handlePrincipal} />)}
          </div>
        )}
      </div>
    </div>
  );
}
