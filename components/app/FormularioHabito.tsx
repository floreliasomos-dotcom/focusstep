'use client';

// Formulario de crear/editar un hábito (pantalla /habitos). Nombre corto, momento del día y color
// (color POR HÁBITO — decisión aprobada en Sesión 2, FICHA-ARTE.md).

import { useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { Check, AlertCircle } from 'lucide-react';
import { BotonPrimario } from '@/components/funnel/ui';
import { COLORES_HABITO, type MomentoDia } from '@/lib/habitos';

const MOMENTOS: { valor: MomentoDia; etiqueta: string }[] = [
  { valor: 'Mis mañanas', etiqueta: 'Mañana' },
  { valor: 'Mi trabajo', etiqueta: 'Trabajo' },
  { valor: 'Mi descanso', etiqueta: 'Descanso' },
];

export interface DatosHabito {
  nombre: string;
  momentoDia: MomentoDia;
  color: string;
}

export function FormularioHabito({
  inicial,
  titulo,
  textoGuardar,
  error,
  onGuardar,
  onCancelar,
}: {
  inicial: DatosHabito;
  titulo: string;
  textoGuardar: string;
  error?: string | null;
  onGuardar: (d: DatosHabito) => void;
  onCancelar: () => void;
}) {
  const reduce = useReducedMotion();
  const [nombre, setNombre] = useState(inicial.nombre);
  const [momento, setMomento] = useState<MomentoDia>(inicial.momentoDia);
  const [color, setColor] = useState(inicial.color);
  const [intento, setIntento] = useState(false);
  const nombreCorto = nombre.trim().length < 2;

  function enviar(e: React.FormEvent) {
    e.preventDefault();
    setIntento(true);
    if (nombreCorto) return;
    onGuardar({ nombre: nombre.trim(), momentoDia: momento, color });
  }

  return (
    <motion.form
      onSubmit={enviar}
      initial={{ opacity: 0, y: reduce ? 0 : 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reduce ? 0.1 : 0.25 }}
      className="flex flex-col gap-4 rounded-[var(--radius-card)] bg-[var(--surface)] p-4 shadow-[0_4px_12px_-4px_color-mix(in_oklab,var(--accent)_30%,transparent)]"
    >
      <h2 className="text-[16px] font-bold [font-family:var(--font-display)]">{titulo}</h2>

      <div className="flex flex-col gap-2">
        <label htmlFor="nombre-habito" className="text-[12px] font-bold text-[var(--text-secondary)]">
          ¿Cuál es tu paso? (corto y fácil)
        </label>
        <input
          id="nombre-habito"
          autoFocus
          maxLength={60}
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          placeholder="Ej: Estirar 5 minutos al despertar"
          aria-invalid={intento && nombreCorto}
          className={`h-14 w-full rounded-[var(--radius-card)] border bg-[var(--surface)] px-4 text-[16px] outline-none focus:border-[var(--accent)] ${
            intento && nombreCorto
              ? 'border-[var(--error)]'
              : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)]'
          }`}
        />
        {intento && nombreCorto && (
          <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
            <AlertCircle size={14} /> Escribe al menos 2 letras.
          </p>
        )}
      </div>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[12px] font-bold text-[var(--text-secondary)]">¿Cuándo lo haces?</legend>
        <div className="flex gap-2">
          {MOMENTOS.map((m) => (
            <button
              key={m.valor}
              type="button"
              aria-pressed={momento === m.valor}
              onClick={() => setMomento(m.valor)}
              className={`h-11 flex-1 rounded-[var(--radius-button)] border text-[12px] font-bold ${
                momento === m.valor
                  ? 'border-[var(--accent)] bg-[color-mix(in_oklab,var(--accent)_10%,transparent)] text-[var(--text-primary)]'
                  : 'border-[color-mix(in_oklab,var(--text-secondary)_25%,transparent)] text-[var(--text-secondary)]'
              }`}
            >
              {m.etiqueta}
            </button>
          ))}
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-2 text-[12px] font-bold text-[var(--text-secondary)]">Color de su etiqueta</legend>
        <div className="flex gap-3">
          {COLORES_HABITO.map((c) => (
            <button
              key={c.valor}
              type="button"
              aria-label={c.nombre}
              aria-pressed={color === c.valor}
              onClick={() => setColor(c.valor)}
              className="flex size-11 items-center justify-center rounded-full"
              style={{
                background: c.valor,
                boxShadow: color === c.valor ? '0 0 0 3px var(--surface), 0 0 0 5px var(--text-primary)' : undefined,
              }}
            >
              {color === c.valor && <Check size={18} color="var(--text-primary)" strokeWidth={3} />}
            </button>
          ))}
        </div>
      </fieldset>

      {error && (
        <p aria-live="polite" className="flex items-center gap-1.5 text-[12px] font-semibold text-[var(--error)]">
          <AlertCircle size={14} /> {error}
        </p>
      )}

      <div className="flex flex-col gap-2">
        <BotonPrimario type="submit">{textoGuardar}</BotonPrimario>
        <button
          type="button"
          onClick={onCancelar}
          className="h-11 w-full text-center text-[12px] font-bold text-[var(--text-secondary)] underline"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}
