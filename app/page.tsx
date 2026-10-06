'use client';

// Página de ventas de FocusStep — 10 secciones canónicas de 19-PAGINA-DE-VENTAS.md
// Copy marcado trazado a docs/copy/landing.md ← FICHA-AVATAR.md. Tokens de FICHA-ARTE.md
// vía components/landing/tokens.css. Modelo onboarding-first (ver ESTADO.md): todo CTA
// lleva a /onboarding, nunca a un checkout directo.
//
// Sección 7 (Garantía) queda OMITIDA a propósito — ver nota en docs/copy/landing.md §7:
// no se puede publicar un plazo de garantía sin verificarlo antes contra Hotmart
// (FICHA-MERCADO.md §4, pendiente de Sesión 6). En su lugar, Oferta y CtaFinal comunican
// el mismo alivio ("7 días gratis, cancela cuando quieras") sin usar la
// palabra "garantía" ni afirmar un plazo de reembolso que todavía no existe.

import Image from 'next/image';
import { Frown, ListTodo, RotateCcw, Users } from 'lucide-react';
import { Hero } from '@/components/landing/Hero';
import { Problema } from '@/components/landing/Problema';
import { Agitacion } from '@/components/landing/Agitacion';
import { Solucion } from '@/components/landing/Solucion';
import { AppPorDentro } from '@/components/landing/AppPorDentro';
import { Oferta } from '@/components/landing/Oferta';
import { Faq } from '@/components/landing/Faq';
import { CtaFinal } from '@/components/landing/CtaFinal';
import { FooterLegal } from '@/components/landing/FooterLegal';
import { StickyCtaMobile } from '@/components/landing/ui';

const CTA_HREF = '/onboarding';
const CTA_LABEL = 'Empezar mi primer paso gratis';

export default function Home() {
  return (
    <div className="min-h-dvh bg-[var(--bg)] text-[var(--text-primary)] [font-family:var(--font-body)]">
      {/* 1. HERO */}
      <Hero
        appName="FocusStep"
        loginHref="/entrar"
        h1Marked="Retoma hoy con [acento]un solo paso[/acento], sin culpa"
        subtitleMarked="Una sola tarea al día — [b]nunca una lista que te abruma[/b]."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        socialProof={<span>7 días gratis · cancela cuando quieras</span>}
        visualPlaceholderSugerencia="captura de la pantalla Un Solo Foco, con el hábito de hoy y el botón Completar"
        visual={
          <div className="flex justify-center bg-[var(--surface)] py-10">
            <Image
              src="/capturas/home-un-solo-foco.png"
              alt="Pantalla Un Solo Foco de FocusStep: el hábito de hoy, la mascota y el botón Completar"
              width={280}
              height={607}
              className="h-auto w-[240px] rounded-[48px] md:w-[280px]"
              priority
            />
          </div>
        }
      />

      {/* 2. PROBLEMA */}
      <Problema
        titulo="¿Te suena?"
        preguntas={[
          { icon: RotateCcw, textoMarked: '¿Empiezas motivada y a la semana ya dejaste la app?' },
          { icon: Frown, textoMarked: '¿Sientes que fallar un día significa que [b]todo se arruinó[/b]?' },
          { icon: ListTodo, textoMarked: '¿Tienes tantas cosas en la lista que no sabes por dónde empezar?' },
          { icon: Users, textoMarked: '¿Sientes que todas las demás sí pueden con todo, menos tú?' },
        ]}
      />

      {/* 3. AGITACIÓN */}
      <Agitacion
        frases={[
          'Cada vez que abandonas un sistema, [b]vuelves a empezar de cero[/b] con la confianza un poco más golpeada.',
          'Si nada cambia, en 6 meses sigues [b]empezando de nuevo cada lunes[/b] — otra vez desde cero.',
          'Más listas y más apps no resuelven la culpa: la causa es que [acento]castigan tus días difíciles[/acento].',
        ]}
        contraste={{
          labelHoy: 'Hoy',
          hoy: 'Otra vez la app abandonada en la pantalla 3, y la sensación de "otra vez fallé".',
          labelFuturo: 'En 6 meses, si nada cambia',
          futuro: 'El mismo ciclo de empezar y abandonar — con 6 meses menos y la misma culpa.',
        }}
      />

      {/* 4. SOLUCIÓN */}
      <Solucion
        tituloMarked="Un [acento]solo paso[/acento], nunca una lista"
        mecanismo="el Método Un Solo Paso"
        bigIdeaMarked="No te falta disciplina — te sobra [b]lista[/b]. El Método Un Solo Paso te muestra una sola cosa a la vez, y si fallas un día, no borra nada."
        pasos={[
          { titulo: 'Elige tu hábito', detalle: 'Máximo 3 hábitos activos — nunca una lista larga.' },
          { titulo: 'Ves solo uno', detalle: 'Una sola tarjeta: tu único paso de hoy.' },
          { titulo: 'Completas y sigues', detalle: 'Un mal día no borra tu progreso.' },
        ]}
        antesDespues={{
          labelAntes: 'Antes',
          antes: 'Una lista de hábitos a medio cumplir y la culpa de haber fallado.',
          labelDespues: 'Después',
          despues: 'Un solo paso cada día, y un "Reinicio Amigable" si faltaste unos días.',
        }}
      />

      {/* 5. LA APP POR DENTRO */}
      <AppPorDentro
        tituloMarked="Tu día, [acento]un paso a la vez[/acento]"
        frames={[
          { src: '/capturas/home-un-solo-foco.png', label: 'Tu único paso de hoy', nombrePantalla: 'Un Solo Foco' },
          { src: '/capturas/onboarding-meta.png', label: 'Así empiezas, en menos de 60 segundos', nombrePantalla: 'Onboarding' },
          { src: '/capturas/reinicio-amigable.png', label: 'Vuelve sin culpa cuando faltes', nombrePantalla: 'Reinicio Amigable' },
          { src: '/capturas/modo-dia-dificil.png', label: 'Reduce tu meta en un día difícil', nombrePantalla: 'Modo Día Difícil' },
        ]}
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
      />

      {/* 6. OFERTA — anual primero, trial en ambos planes (7 días, ESTADO.md), total visible.
          Sin lenguaje de "garantía" — ver nota de cabecera del archivo. */}
      <Oferta
        tituloMarked="Empieza gratis. Sigue por [acento]menos de US$0.10/día[/acento]"
        trialDias={7}
        anual={{
          nombre: 'Anual',
          badge: 'MEJOR PRECIO',
          precioMes: 'US$2.92',
          totalAnual: 'Se cobra US$34.99/año',
          ahorro: '5 meses gratis',
          descomposicionDia: 'menos de US$0.10 al día',
          ctaLabel: 'Empezar mis 7 días gratis',
          ctaHref: CTA_HREF,
          features: [
            'Hábitos ilimitados (no solo 3)',
            'Modo Día Difícil siempre disponible',
            'Notificaciones avanzadas por bloques',
            'Frases motivacionales de tu mascota',
            'Cancela en 1 clic, sin preguntas',
          ],
        }}
        mensual={{
          nombre: 'Mensual',
          precioMes: 'US$4.99',
          descomposicionDia: 'menos de US$0.17 al día',
          ctaLabel: 'Elegir mensual',
          ctaHref: CTA_HREF,
          features: [
            'Hábitos ilimitados (no solo 3)',
            'Modo Día Difícil siempre disponible',
            'Notificaciones avanzadas por bloques',
            'Cancela en 1 clic, sin preguntas',
          ],
        }}
      />

      {/* 8. FAQ — objeciones literales de FICHA-AVATAR.md */}
      <Faq
        items={[
          {
            pregunta: '¿No tengo tiempo para otra app?',
            respuestaMarked: 'Tu primer paso toma menos de 60 segundos — [b]no hay nada que configurar[/b].',
          },
          {
            pregunta: 'Ya probé apps de hábitos y las abandoné',
            respuestaMarked: 'Por eso FocusStep no usa rachas: si fallas un día, no pierdes nada — solo retomas.',
          },
          {
            pregunta: '¿Esto es solo para gente con TDAH?',
            respuestaMarked: 'No — es para cualquiera con la vida llena de pendientes. El TDAH es solo uno de los casos donde más se siente el alivio.',
          },
          {
            pregunta: '¿Y si no lo uso y pierdo mi dinero?',
            respuestaMarked: 'Menos de US$0.10 al día en el plan anual, y tus [b]7 días de prueba son gratis[/b]: si no te sirve, cancelas antes del primer cobro.',
          },
          {
            pregunta: '¿Es seguro poner mi tarjeta?',
            respuestaMarked: 'El pago lo procesa Hotmart, la misma pasarela que usan miles de cursos y apps en LATAM — nunca guardamos tu tarjeta nosotros.',
          },
          {
            pregunta: '¿Qué pasa si no me sirve?',
            respuestaMarked: 'Cancelas cuando quieras desde tu cuenta, sin llamadas ni formularios.',
          },
        ]}
      />

      {/* 9. CTA FINAL EMOCIONAL — sin "garantía", ver nota de cabecera */}
      <CtaFinal
        h2Marked="Imagina tu día, [acento]un paso a la vez[/acento]"
        futurePacingMarked="Hoy elijes un solo hábito, lo completas, y por primera vez en semanas no sientes que fallaste."
        ctaLabel={CTA_LABEL}
        ctaHref={CTA_HREF}
        recap="7 días de prueba gratis · cancela cuando quieras"
        psMarked="PS: FocusStep te da un solo hábito a la vez y un Reinicio Amigable para los días que faltes — sin rachas que castiguen. Hoy entras gratis por 7 días y cancelas cuando quieras."
      />

      {/* 10. FOOTER LEGAL */}
      <FooterLegal
        appName="FocusStep"
        soporteEmail="soporte@focusstep.app"
        enlaces={[
          { label: 'Privacidad', href: '/privacidad' },
          { label: 'Términos y Condiciones', href: '/terminos' },
          { label: 'Reembolsos', href: '/reembolsos' },
          { label: 'Aviso de IA', href: '/aviso-ia' },
        ]}
      />

      <StickyCtaMobile labelComercial={CTA_LABEL} href={CTA_HREF} />
    </div>
  );
}
