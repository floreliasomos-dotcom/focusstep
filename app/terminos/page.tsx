import { LegalPage, LegalSection } from '@/components/landing/LegalPage';

export const metadata = { title: 'Términos y Condiciones — FocusStep' };

export default function Terminos() {
  return (
    <LegalPage titulo="Términos y Condiciones" actualizado="21 de septiembre de 2026">
      <p>
        Al usar FocusStep aceptas estos términos. Los escribimos en lenguaje simple porque
        creemos que deberías poder entenderlos sin ayuda.
      </p>

      <LegalSection titulo="Qué es FocusStep">
        <p>
          FocusStep es una aplicación web para organizar hábitos, pensada para usarse día a día.
          El plan gratuito permite hasta 3 hábitos activos; el plan Pro desbloquea hábitos
          ilimitados y funciones adicionales.
        </p>
      </LegalSection>

      <LegalSection titulo="Tu cuenta">
        <p>
          Eres responsable de mantener segura tu contraseña. Si sospechas que alguien más accedió
          a tu cuenta, escríbenos de inmediato.
        </p>
      </LegalSection>

      <LegalSection titulo="Pagos y suscripción">
        <p>
          Los pagos se procesan a través de Hotmart. La suscripción se renueva automáticamente
          según el plan elegido (mensual o anual) hasta que la canceles desde tu cuenta o desde
          Hotmart. Puedes cancelar en cualquier momento; seguirás teniendo acceso hasta el final
          del período ya pagado.
        </p>
      </LegalSection>

      <LegalSection titulo="Uso aceptable">
        <p>
          No está permitido usar FocusStep para actividades ilegales, intentar acceder a cuentas
          de otras personas, ni realizar ingeniería inversa de la aplicación.
        </p>
      </LegalSection>

      <LegalSection titulo="Cambios en el servicio">
        <p>
          Podemos actualizar estos términos o la aplicación con el tiempo. Si un cambio afecta
          materialmente tu plan, te avisaremos por correo con anticipación razonable.
        </p>
      </LegalSection>

      <LegalSection titulo="Contacto">
        <p>
          Dudas sobre estos términos:{' '}
          <a className="font-semibold text-[var(--accent)] underline" href="mailto:soporte@focusstep.app">
            soporte@focusstep.app
          </a>
        </p>
      </LegalSection>
    </LegalPage>
  );
}
