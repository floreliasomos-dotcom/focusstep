import { AppShell } from '@/components/app/AppShell';
import { ProximamenteScreen } from '@/components/app/ProximamenteScreen';

export default function Progreso() {
  return (
    <AppShell>
      <ProximamenteScreen
        titulo="Tu progreso, sin culpa"
        mensaje="Aquí vas a ver tu cumplimiento semanal a lo largo del tiempo — todavía la estamos construyendo."
      />
    </AppShell>
  );
}
