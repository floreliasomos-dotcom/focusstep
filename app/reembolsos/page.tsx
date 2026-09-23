import { LegalPage, LegalSection } from '@/components/landing/LegalPage';

export const metadata = { title: 'Reembolsos — FocusStep' };

export default function Reembolsos() {
  return (
    <LegalPage titulo="Política de Reembolsos" actualizado="21 de septiembre de 2026">
      <p>
        Queremos que pruebes FocusStep con confianza. Por eso todas las compras se procesan a
        través de Hotmart, y el plazo de reembolso aplicable es el que Hotmart confirma en tu
        recibo de compra al momento de pagar.
      </p>

      <LegalSection titulo="Cómo pedir un reembolso">
        <p>
          Escríbenos a{' '}
          <a className="font-semibold text-[var(--accent)] underline" href="mailto:soporte@focusstep.app">
            soporte@focusstep.app
          </a>{' '}
          con el correo que usaste para comprar, o solicita el reembolso directamente desde tu
          cuenta de Hotmart. Te confirmamos el estado de tu solicitud en menos de 48 horas hábiles.
        </p>
      </LegalSection>

      <LegalSection titulo="Prueba gratuita">
        <p>
          Si estás dentro de tu período de prueba gratuita, puedes cancelar en cualquier momento
          desde tu cuenta sin que se te cobre nada.
        </p>
      </LegalSection>

      <LegalSection titulo="Renovaciones">
        <p>
          Si tu suscripción ya se renovó y quieres un reembolso de ese cobro, contáctanos: cada
          caso se revisa según el plazo vigente que Hotmart tenga configurado para FocusStep en
          ese momento.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
