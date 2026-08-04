"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/context/AuthContext";
import { Button, Input, PhoneInput, validatePhone, buildPhoneValue } from "@/components/ui";
import {
  verificarIdentidad,
  enviarCodigo,
  verificarCodigo,
  activarCuenta,
  registrarCliente,
} from "@/services/auth";
import { Mail, Phone, Lock, User, Eye, EyeOff, ArrowLeft, RefreshCw } from "lucide-react";
import Link from "next/link";

// ─── Paso 1: identificador ───────────────────────────────────────────────────

function StepIdentificador({ onNext }) {
  const [modoEmail, setModoEmail] = useState(false);
  const [email, setEmail] = useState("");
  const [prefix, setPrefix] = useState("+595");
  const [numeroLocal, setNumeroLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    let idFinal;

    if (modoEmail) {
      if (!email.trim()) return;
      idFinal = email.trim();
    } else {
      const phoneError = validatePhone(prefix, numeroLocal);
      if (phoneError) { setError(phoneError); return; }
      idFinal = buildPhoneValue(prefix, numeroLocal);
    }

    setLoading(true);
    try {
      const resultado = await verificarIdentidad(idFinal);
      onNext({ identificador: idFinal, ...resultado });
    } catch (err) {
      setError(err.data?.detail || "Error al verificar. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  function cambiarModo() {
    setModoEmail((m) => !m);
    setError("");
    setEmail("");
    setNumeroLocal("");
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-dental-blue-light rounded-2xl flex items-center justify-center mx-auto mb-4">
          {modoEmail ? <Mail size={26} className="text-dental-blue" /> : <Phone size={26} className="text-dental-blue" />}
        </div>
        <h1 className="text-2xl font-black text-gray-900">Ingresar a la Tienda</h1>
        <p className="text-gray-500 mt-1.5 text-sm">
          {modoEmail
            ? "Ingresá tu dirección de email para continuar."
            : "Ingresá tu número de celular para continuar."}
        </p>
      </div>

      {error && <ErrorBanner mensaje={error} />}

      {modoEmail ? (
        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ej: usuario@email.com"
          icon={Mail}
          autoComplete="email"
          autoFocus
          required
        />
      ) : (
        <PhoneInput
          label="Número de celular"
          prefix={prefix}
          onPrefixChange={setPrefix}
          value={numeroLocal}
          onChange={(e) => setNumeroLocal(e.target.value)}
          required
          autoFocus
        />
      )}

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || (modoEmail ? !email.trim() : !numeroLocal.trim())}
      >
        {loading ? "Verificando..." : "Continuar"}
      </Button>

      <button
        type="button"
        onClick={cambiarModo}
        className="w-full text-center text-sm text-gray-400 hover:text-dental-blue transition-colors"
      >
        {modoEmail
          ? "¿Preferís usar tu celular? Ingresá con WhatsApp"
          : "¿Preferís usar email? Ingresá con tu correo"}
      </button>
    </form>
  );
}

// ─── Paso 2: login con contraseña ────────────────────────────────────────────

function StepLogin({ identificador, razonSocial, onBack, onSuccess }) {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(identificador, password);
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Contraseña incorrecta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo={`Hola, ${razonSocial?.split(" ")[0] || "bienvenido"}`}
        subtitulo={`Ingresando como ${identificador}`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Tu contraseña"
        icon={Lock}
        autoComplete="current-password"
        autoFocus
        required
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 -mt-2"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseña
      </button>

      <Button type="submit" className="w-full" size="lg" disabled={loading || !password}>
        {loading ? "Ingresando..." : "Ingresar"}
      </Button>
    </form>
  );
}

// ─── Paso 2: envío de código OTP ─────────────────────────────────────────────

function StepEnviarCodigo({ identificador, proposito, razonSocial, canal, onNext, onBack }) {
  const [loading, setLoading] = useState(false);
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState("");
  const [bloqueado, setBloqueado] = useState(false);
  const [cooldown, setCooldown] = useState(0); // segundos restantes

  // Countdown ticker
  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const esActivar = proposito === "activar";
  const canalLabel = canal === "email" ? "email" : "WhatsApp";

  async function enviar() {
    setError("");
    setLoading(true);
    try {
      const resp = await enviarCodigo(identificador, proposito);
      setEnviado(true);
      setCooldown(resp.cooldown_segundos ?? 60);
      // En desarrollo, abrir preview del email/código automáticamente
      if (resp.preview_url) window.open(resp.preview_url, "_blank");
    } catch (err) {
      const data = err.data || {};
      if (err.status === 429) {
        if (data.bloqueado) {
          setBloqueado(true);
          setError(data.detail);
        } else {
          setCooldown(data.cooldown_restante ?? 60);
          setError(data.detail);
        }
      } else {
        setError(data.detail || "Error enviando el código.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <StepHeader
        titulo={esActivar ? "Activar tu cuenta" : "Crear cuenta nueva"}
        subtitulo={
          esActivar
            ? `Hola ${razonSocial?.split(" ")[0] || ""}. Tu cuenta está lista, solo falta crear una contraseña.`
            : "Te enviaremos un código para verificar tu identidad."
        }
        onBack={onBack}
        icon={Mail}
      />

      {error && <ErrorBanner mensaje={error} />}

      {bloqueado ? (
        <div className="bg-amber-50 border border-amber-100 rounded-xl p-4 text-sm text-amber-700 text-center">
          <p className="font-semibold mb-1">Demasiados intentos</p>
          <p>Esperá 10 minutos antes de solicitar un nuevo código.</p>
        </div>
      ) : !enviado ? (
        <>
          <div className="bg-sky-50 border border-sky-100 rounded-xl p-4 text-sm text-sky-700">
            Te enviaremos un código de 6 dígitos a tu <strong>{canalLabel}</strong>:{" "}
            <span className="font-semibold">{identificador}</span>
          </div>
          <Button className="w-full" size="lg" onClick={enviar} disabled={loading}>
            {loading ? "Enviando..." : `Enviar código por ${canalLabel}`}
          </Button>
        </>
      ) : (
        <>
          <div className="bg-green-50 border border-green-100 rounded-xl p-4 text-sm text-green-700">
            ✓ Código enviado a <strong>{identificador}</strong>. Revisá tu {canalLabel}.
          </div>
          <Button
            className="w-full"
            size="lg"
            onClick={() => onNext({ identificador, proposito, canal, razonSocial })}
          >
            Tengo mi código →
          </Button>
          <button
            type="button"
            onClick={enviar}
            disabled={loading || cooldown > 0}
            className="w-full flex items-center justify-center gap-1.5 text-sm text-gray-400 hover:text-gray-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
            {cooldown > 0
              ? `Reenviar en ${cooldown}s`
              : "Reenviar código"}
          </button>
        </>
      )}
    </div>
  );
}

// ─── Paso 3: verificar código ────────────────────────────────────────────────

function StepVerificarCodigo({ identificador, proposito, canal, razonSocial, onNext, onBack }) {
  const [codigo, setCodigo] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (codigo.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const { token_verificacion_id } = await verificarCodigo(identificador, codigo, proposito);
      onNext({ identificador, proposito, canal, razonSocial, tokenVerificacionId: token_verificacion_id });
    } catch (err) {
      setError(err.data?.detail || "Código incorrecto.");
      setCodigo("");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo="Verificá tu código"
        subtitulo={`Ingresá el código de 6 dígitos que enviamos a tu ${canal === "email" ? "email" : "WhatsApp"}.`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <div>
        <Input
          label="Código de verificación"
          type="text"
          inputMode="numeric"
          pattern="[0-9]{6}"
          maxLength={6}
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ""))}
          placeholder="123456"
          autoFocus
          required
          className="text-center text-2xl tracking-[0.5em] font-black"
        />
        <p className="text-xs text-gray-400 mt-1.5 text-center">
          El código expira en 5 minutos.
        </p>
      </div>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || codigo.length !== 6}
      >
        {loading ? "Verificando..." : "Verificar código"}
      </Button>
    </form>
  );
}

// ─── Paso 4a: crear contraseña (activar) ─────────────────────────────────────

function StepCrearPassword({ identificador, proposito, tokenVerificacionId, razonSocial, canal, onSuccess, onBack }) {
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const esActivar = proposito === "activar";

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmar) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (password.length < 8) {
      setError("La contraseña debe tener al menos 8 caracteres.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      if (esActivar) {
        await activarCuenta(identificador, password, tokenVerificacionId);
      }
      // Para registrar se llama desde StepRegistrar
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Error al crear la contraseña.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <StepHeader
        titulo="Creá tu contraseña"
        subtitulo={`Elegí una contraseña segura para tu cuenta${razonSocial ? ` (${razonSocial})` : ""}.`}
        onBack={onBack}
        icon={Lock}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        icon={Lock}
        autoFocus
        required
        helperText="Usá letras, números y símbolos para mayor seguridad."
      />

      <Input
        label="Confirmar contraseña"
        type={showPassword ? "text" : "password"}
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Repetí tu contraseña"
        icon={Lock}
        required
        error={confirmar && password !== confirmar ? "Las contraseñas no coinciden" : ""}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600 -mt-2"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseñas
      </button>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !password || !confirmar}
      >
        {loading ? "Guardando..." : "Confirmar contraseña"}
      </Button>
    </form>
  );
}

// ─── Paso 4b: datos de registro ───────────────────────────────────────────────

function StepRegistrar({ identificador, tokenVerificacionId, canal, onSuccess, onBack }) {
  const [razonSocial, setRazonSocial] = useState("");
  const [celularPrefix, setCelularPrefix] = useState("+595");
  const [celularNumero, setCelularNumero] = useState("");
  const [password, setPassword] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const esEmail = identificador.includes("@");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confirmar) { setError("Las contraseñas no coinciden."); return; }
    if (password.length < 8) { setError("La contraseña debe tener al menos 8 caracteres."); return; }
    if (!razonSocial.trim()) { setError("El nombre es requerido."); return; }

    // Validar celular si lo llenó
    if (esEmail && celularNumero.trim()) {
      const phoneError = validatePhone(celularPrefix, celularNumero);
      if (phoneError) { setError(phoneError); return; }
    }

    setError("");
    setLoading(true);
    try {
      await registrarCliente({
        identificador,
        password,
        razon_social: razonSocial.trim(),
        celular: esEmail
          ? buildPhoneValue(celularPrefix, celularNumero)
          : identificador,
        tokenVerificacionId,
      });
      onSuccess();
    } catch (err) {
      setError(err.data?.detail || "Error al crear la cuenta.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <StepHeader
        titulo="Completá tus datos"
        subtitulo="Casi listo. Completá tu información para crear la cuenta."
        onBack={onBack}
        icon={User}
      />

      {error && <ErrorBanner mensaje={error} />}

      <Input
        label="Nombre completo o razón social"
        type="text"
        value={razonSocial}
        onChange={(e) => setRazonSocial(e.target.value)}
        placeholder="Ej: Juan Pérez o Clínica Dental"
        icon={User}
        autoFocus
        required
      />

      {/* Si identificador es email, pedimos celular opcional con PhoneInput */}
      {esEmail && (
        <PhoneInput
          label="Celular (opcional)"
          prefix={celularPrefix}
          onPrefixChange={setCelularPrefix}
          value={celularNumero}
          onChange={(e) => setCelularNumero(e.target.value)}
          helperText="Para recibir notificaciones por WhatsApp."
          error={celularNumero ? validatePhone(celularPrefix, celularNumero) : ""}
        />
      )}

      <Input
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Mínimo 8 caracteres"
        icon={Lock}
        required
      />

      <Input
        label="Confirmar contraseña"
        type={showPassword ? "text" : "password"}
        value={confirmar}
        onChange={(e) => setConfirmar(e.target.value)}
        placeholder="Repetí tu contraseña"
        icon={Lock}
        required
        error={confirmar && password !== confirmar ? "Las contraseñas no coinciden" : ""}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-600"
      >
        {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
        {showPassword ? "Ocultar" : "Mostrar"} contraseñas
      </button>

      <Button
        type="submit"
        className="w-full"
        size="lg"
        disabled={loading || !razonSocial || !password || !confirmar}
      >
        {loading ? "Creando cuenta..." : "Crear cuenta"}
      </Button>

      <p className="text-xs text-gray-400 text-center">
        Al registrarte aceptás nuestros{" "}
        <Link href="/about" className="text-dental-blue hover:underline">
          términos de uso
        </Link>
        .
      </p>
    </form>
  );
}

// ─── Éxito ────────────────────────────────────────────────────────────────────

function StepExito({ proposito }) {
  const router = useRouter();
  return (
    <div className="text-center space-y-5 py-4">
      <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto">
        <span className="text-3xl">✓</span>
      </div>
      <div>
        <h2 className="text-xl font-black text-gray-900">
          {proposito === "registrar" ? "¡Bienvenido!" : "¡Cuenta activada!"}
        </h2>
        <p className="text-gray-500 text-sm mt-1.5">
          {proposito === "registrar"
            ? "Tu cuenta fue creada exitosamente. Ya podés ver precios y hacer pedidos."
            : "Tu cuenta está lista. Ya podés ingresar a la tienda."}
        </p>
      </div>
      <Button className="w-full" size="lg" onClick={() => router.push("/")}>
        Ir a la tienda
      </Button>
    </div>
  );
}

// ─── Componentes auxiliares ───────────────────────────────────────────────────

function StepHeader({ titulo, subtitulo, onBack, icon: Icon }) {
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

function ErrorBanner({ mensaje }) {
  return (
    <div className="bg-red-50 border border-red-100 text-red-700 px-4 py-3 rounded-xl text-sm">
      {mensaje}
    </div>
  );
}

// ─── Máquina de pasos ────────────────────────────────────────────────────────

const PASOS = {
  IDENTIFICADOR: "identificador",
  LOGIN: "login",
  ENVIAR_CODIGO: "enviar_codigo",
  VERIFICAR_CODIGO: "verificar_codigo",
  CREAR_PASSWORD: "crear_password",
  REGISTRAR: "registrar",
  EXITO: "exito",
};

export default function LoginPage() {
  const router = useRouter();
  const { login: authLogin } = useAuth();
  const [paso, setPaso] = useState(PASOS.IDENTIFICADOR);
  const [datos, setDatos] = useState({});

  function irA(nuevoPaso, nuevosDatos = {}) {
    setDatos((prev) => ({ ...prev, ...nuevosDatos }));
    setPaso(nuevoPaso);
  }

  // Paso 1 → detectar flujo
  function handleIdentificadorNext({ identificador, estado, canal, razon_social }) {
    const base = { identificador, canal, razonSocial: razon_social };
    if (estado === "login") {
      irA(PASOS.LOGIN, base);
    } else {
      // activar o registrar → verificar identidad primero
      irA(PASOS.ENVIAR_CODIGO, { ...base, proposito: estado });
    }
  }

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">

          {paso === PASOS.IDENTIFICADOR && (
            <StepIdentificador onNext={handleIdentificadorNext} />
          )}

          {paso === PASOS.LOGIN && (
            <StepLogin
              identificador={datos.identificador}
              razonSocial={datos.razonSocial}
              onBack={() => setPaso(PASOS.IDENTIFICADOR)}
              onSuccess={() => router.push("/")}
            />
          )}

          {paso === PASOS.ENVIAR_CODIGO && (
            <StepEnviarCodigo
              identificador={datos.identificador}
              proposito={datos.proposito}
              razonSocial={datos.razonSocial}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.IDENTIFICADOR)}
              onNext={(d) => irA(PASOS.VERIFICAR_CODIGO, d)}
            />
          )}

          {paso === PASOS.VERIFICAR_CODIGO && (
            <StepVerificarCodigo
              identificador={datos.identificador}
              proposito={datos.proposito}
              canal={datos.canal}
              razonSocial={datos.razonSocial}
              onBack={() => setPaso(PASOS.ENVIAR_CODIGO)}
              onNext={(d) => {
                if (datos.proposito === "activar") {
                  irA(PASOS.CREAR_PASSWORD, d);
                } else {
                  irA(PASOS.REGISTRAR, d);
                }
              }}
            />
          )}

          {paso === PASOS.CREAR_PASSWORD && (
            <StepCrearPassword
              identificador={datos.identificador}
              proposito={datos.proposito}
              tokenVerificacionId={datos.tokenVerificacionId}
              razonSocial={datos.razonSocial}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.VERIFICAR_CODIGO)}
              onSuccess={() => irA(PASOS.EXITO)}
            />
          )}

          {paso === PASOS.REGISTRAR && (
            <StepRegistrar
              identificador={datos.identificador}
              tokenVerificacionId={datos.tokenVerificacionId}
              canal={datos.canal}
              onBack={() => setPaso(PASOS.VERIFICAR_CODIGO)}
              onSuccess={() => irA(PASOS.EXITO, { proposito: "registrar" })}
            />
          )}

          {paso === PASOS.EXITO && (
            <StepExito proposito={datos.proposito} />
          )}
        </div>

        <p className="text-center text-sm text-gray-400 mt-5">
          ¿Necesitás ayuda?{" "}
          <Link href="/about" className="text-dental-blue hover:underline font-medium">
            Contactanos
          </Link>
        </p>
      </div>
    </div>
  );
}
