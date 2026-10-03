import { AppShell } from '@/components/app/AppShell';
import { ProximamenteScreen } from '@/components/app/ProximamenteScreen';

export default function Perfil() {
  return (
    <AppShell>
      <ProximamenteScreen
        titulo="Tu perfil"
        mensaje="Aquí vas a ver tu plan y ajustes de cuenta — todavía la estamos construyendo."
      />
    </AppShell>
  );
}
