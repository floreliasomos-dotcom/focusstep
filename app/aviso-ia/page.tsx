import { LegalPage, LegalSection } from '@/components/landing/LegalPage';

export const metadata = { title: 'Aviso de IA — FocusStep' };

export default function AvisoIA() {
  return (
    <LegalPage titulo="Aviso de Inteligencia Artificial" actualizado="21 de septiembre de 2026">
      <LegalSection titulo="Uso actual">
        <p>
          FocusStep, en su versión actual, no utiliza inteligencia artificial generativa: no
          genera texto, imágenes ni recomendaciones automatizadas a partir de tus datos. Las
          frases motivacionales que ves en la app son parte de un contenido curado, no generado
          por IA.
        </p>
      </LegalSection>

      <LegalSection titulo="Si esto cambia">
        <p>
          Si en el futuro agregamos alguna función con inteligencia artificial, lo indicaremos
          claramente dentro de esa función y actualizaremos este aviso y la Política de
          Privacidad antes de activarla.
        </p>
      </LegalSection>
    </LegalPage>
  );
}
