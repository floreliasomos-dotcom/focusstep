import { LegalPage, LegalSection } from '@/components/landing/LegalPage';

export const metadata = { title: 'Privacidad — FocusStep' };

export default function Privacidad() {
  return (
    <LegalPage titulo="Política de Privacidad" actualizado="21 de septiembre de 2026">
      <p>
        En FocusStep nos tomamos en serio tu privacidad. Este documento explica qué datos
        recogemos, para qué los usamos y con quién los compartimos.
      </p>

      <LegalSection titulo="Qué datos recogemos">
        <p>
          Tu correo electrónico y nombre (para crear tu cuenta), los hábitos que registras dentro
          de la app y la fecha en que los completas, y datos técnicos básicos de uso (tipo de
          dispositivo, errores) para poder corregir fallas.
        </p>
      </LegalSection>

      <LegalSection titulo="Para qué los usamos">
        <p>
          Para que la app funcione (guardar tu progreso), para enviarte los recordatorios que tú
          configuras, y para mejorar la app con base en cómo se usa en conjunto. Nunca vendemos ni
          compartimos tus datos individuales con terceros para publicidad.
        </p>
      </LegalSection>

      <LegalSection titulo="Con quién los compartimos">
        <p>
          Con los proveedores que hacen posible el servicio: la base de datos donde vive tu
          cuenta, la pasarela de pago Hotmart (procesa tu compra, nunca vemos tu tarjeta) y el
          servicio de envío de correos transaccionales. Ninguno de ellos usa tus datos para fines
          propios de publicidad.
        </p>
      </LegalSection>

      <LegalSection titulo="Inteligencia artificial">
        <p>
          FocusStep no usa inteligencia artificial generativa para crear contenido a partir de tus
          datos personales en esta versión. Si eso cambia, se actualizará este documento y el
          Aviso de IA antes de activarlo.
        </p>
      </LegalSection>

      <LegalSection titulo="Tus derechos">
        <p>
          Puedes pedirnos ver, corregir o eliminar tus datos, y eliminar tu cuenta por completo,
          escribiendo a{' '}
          <a className="font-semibold text-[var(--accent)] underline" href="mailto:soporte@focusstep.app">
            soporte@focusstep.app
          </a>
          .
        </p>
      </LegalSection>
    </LegalPage>
  );
}
